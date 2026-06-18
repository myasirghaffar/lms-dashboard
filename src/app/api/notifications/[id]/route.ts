import { NextRequest, NextResponse } from 'next/server';
import { getCurrentProfile } from '@/lib/academicApi';
import { requireUser } from '@/lib/supabaseServer';

const NOTIFICATION_COLUMNS = 'id, target_profile_id, created_by_profile_id, type, priority, title, message, entity_type, entity_id, action_url, read_at, metadata, created_at, updated_at';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const profile = await getCurrentProfile(auth);
    if (!profile?.id) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const { id } = await params;
    const body = await request.json();
    const read = body.read !== false;

    const { data, error } = await auth.supabase
      .from('notifications')
      .update({ read_at: read ? new Date().toISOString() : null })
      .eq('id', id)
      .eq('target_profile_id', profile.id)
      .select(NOTIFICATION_COLUMNS)
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ notification: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to update notification.' }, { status: 500 });
  }
}
