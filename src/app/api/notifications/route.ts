import { NextRequest, NextResponse } from 'next/server';
import { getCurrentProfile } from '@/lib/academicApi';
import { requireUser } from '@/lib/supabaseServer';
import type { NotificationPayload, NotificationPriority, NotificationType } from '@/types/notifications';
import type { SystemUserRole } from '@/types/user-management';

const NOTIFICATION_COLUMNS = 'id, target_profile_id, created_by_profile_id, type, priority, title, message, entity_type, entity_id, action_url, read_at, metadata, created_at, updated_at';
const PROFILE_COLUMNS = 'id, name, role, auth_user_id';
const NOTIFICATION_TYPES: NotificationType[] = ['system', 'announcement', 'attendance', 'fees', 'payment', 'challan', 'student', 'teacher', 'schedule', 'message', 'exam', 'result', 'admission', 'profile', 'security'];
const NOTIFICATION_PRIORITIES: NotificationPriority[] = ['low', 'normal', 'high', 'urgent'];
const USER_ROLES: SystemUserRole[] = ['SUPER_ADMIN', 'ADMIN', 'BRANCH_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'];

const canManageNotifications = (role?: string) => role === 'SUPER_ADMIN' || role === 'BRANCH_ADMIN';

function cleanNotificationPayload(body: Partial<NotificationPayload>): NotificationPayload {
  const type = String(body.type || 'system') as NotificationType;
  const priority = String(body.priority || 'normal') as NotificationPriority;
  const targetRoles = Array.isArray(body.target_roles)
    ? body.target_roles.map((role) => String(role).trim() as SystemUserRole).filter((role) => USER_ROLES.includes(role))
    : [];

  return {
    target_profile_ids: Array.isArray(body.target_profile_ids) ? body.target_profile_ids.map(String).filter(Boolean) : [],
    target_roles: targetRoles,
    broadcast: Boolean(body.broadcast),
    type: NOTIFICATION_TYPES.includes(type) ? type : 'system',
    priority: NOTIFICATION_PRIORITIES.includes(priority) ? priority : 'normal',
    title: String(body.title || '').trim(),
    message: String(body.message || '').trim(),
    entity_type: String(body.entity_type || '').trim(),
    entity_id: String(body.entity_id || '').trim(),
    action_url: String(body.action_url || '').trim(),
    metadata: typeof body.metadata === 'object' && body.metadata !== null && !Array.isArray(body.metadata) ? body.metadata : {},
  };
}

function validateNotificationPayload(payload: NotificationPayload) {
  if (!payload.title) return 'Notification title is required.';
  if (!payload.broadcast && !payload.target_roles?.length && !payload.target_profile_ids?.length) {
    return 'Select at least one recipient, role, or broadcast.';
  }
  return null;
}

async function decorateNotifications(
  auth: Exclude<Awaited<ReturnType<typeof requireUser>>, { error: string; status: 401 }>,
  notifications: any[],
) {
  if (!notifications.length) return [];

  const profileIds = [...new Set(
    notifications
      .flatMap((notification) => [notification.target_profile_id, notification.created_by_profile_id])
      .filter(Boolean),
  )];

  const { data: profiles, error } = profileIds.length
    ? await auth.supabase.from('user_profiles').select(PROFILE_COLUMNS).in('id', profileIds)
    : { data: [], error: null };
  if (error) throw new Error(error.message);

  const profilesById = new Map((profiles || []).map((profile) => [profile.id, profile]));

  return notifications.map((notification) => ({
    ...notification,
    metadata: notification.metadata || {},
    target_name: notification.target_profile_id ? profilesById.get(notification.target_profile_id)?.name || null : null,
    created_by_name: notification.created_by_profile_id ? profilesById.get(notification.created_by_profile_id)?.name || null : null,
  }));
}

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const profile = await getCurrentProfile(auth);
    if (!profile?.id) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get('limit') || 50), 1), 100);
    const unreadOnly = request.nextUrl.searchParams.get('unread') === 'true';
    const type = request.nextUrl.searchParams.get('type');

    let query = auth.supabase
      .from('notifications')
      .select(NOTIFICATION_COLUMNS)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!canManageNotifications(auth.role) || request.nextUrl.searchParams.get('mine') === 'true') {
      query = query.eq('target_profile_id', profile.id);
    }

    if (unreadOnly) query = query.is('read_at', null);
    if (type && NOTIFICATION_TYPES.includes(type as NotificationType)) query = query.eq('type', type);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const mineQuery = auth.supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('target_profile_id', profile.id)
      .is('read_at', null);
    const { count, error: countError } = await mineQuery;
    if (countError) throw new Error(countError.message);

    return NextResponse.json({
      notifications: await decorateNotifications(auth, data || []),
      unread_count: count || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load notifications.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!canManageNotifications(auth.role)) {
    return NextResponse.json({ error: 'Only school admins can create notifications.' }, { status: 403 });
  }

  const payload = cleanNotificationPayload(await request.json());
  const validationError = validateNotificationPayload(payload);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  try {
    const profile = await getCurrentProfile(auth);
    if (!profile?.id) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    let recipientQuery = auth.supabase.from('user_profiles').select('id, role');
    const explicitIds = payload.target_profile_ids || [];
    const roles = payload.target_roles || [];

    if (payload.broadcast) {
      recipientQuery = recipientQuery.in('role', USER_ROLES);
    } else if (roles.length && explicitIds.length) {
      recipientQuery = recipientQuery.or(`id.in.(${explicitIds.join(',')}),role.in.(${roles.join(',')})`);
    } else if (roles.length) {
      recipientQuery = recipientQuery.in('role', roles);
    } else {
      recipientQuery = recipientQuery.in('id', explicitIds);
    }

    const { data: recipients, error: recipientError } = await recipientQuery;
    if (recipientError) throw new Error(recipientError.message);

    const recipientIds = [...new Set((recipients || []).map((recipient) => recipient.id))];
    if (!recipientIds.length) return NextResponse.json({ error: 'No matching recipients found.' }, { status: 404 });

    const rows = recipientIds.map((targetProfileId) => ({
      target_profile_id: targetProfileId,
      created_by_profile_id: profile.id,
      type: payload.type,
      priority: payload.priority || 'normal',
      title: payload.title,
      message: payload.message || '',
      entity_type: payload.entity_type || '',
      entity_id: payload.entity_id || '',
      action_url: payload.action_url || '',
      metadata: payload.metadata || {},
    }));

    const { data, error } = await auth.supabase
      .from('notifications')
      .insert(rows)
      .select(NOTIFICATION_COLUMNS);
    if (error) throw new Error(error.message);

    return NextResponse.json({
      notifications: await decorateNotifications(auth, data || []),
      created_count: data?.length || 0,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create notifications.' }, { status: 500 });
  }
}
