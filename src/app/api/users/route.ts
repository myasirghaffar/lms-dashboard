import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';

const USER_COLUMNS = 'id, auth_user_id, email, name, role, phone_number, address, profile_image, branch_id, created_at, updated_at';
const VALID_ROLES = ['SUPER_ADMIN', 'ADMIN', 'BRANCH_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'];

const canManageUsers = (role?: string) => role === 'SUPER_ADMIN' || role === 'BRANCH_ADMIN';

export async function GET(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (!canManageUsers(auth.role)) {
        return NextResponse.json({ error: 'Only school admins can view system users.' }, { status: 403 });
    }

    const roleParam = request.nextUrl.searchParams.get('role');
    const roles = roleParam?.split(',').map((role) => role.trim()).filter(Boolean);

    let query = auth.supabase
        .from('user_profiles')
        .select(USER_COLUMNS)
        .order('created_at', { ascending: true });

    if (roles?.length) {
        query = query.in('role', roles);
    }

    const { data: users, error } = await query;
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const branchIds = [...new Set((users || []).map((user) => user.branch_id).filter(Boolean))];
    const branchNames = new Map<string, string>();

    if (branchIds.length) {
        const { data: branches, error: branchError } = await auth.supabase
            .from('branches')
            .select('id, name')
            .in('id', branchIds);

        if (branchError) {
            return NextResponse.json({ error: branchError.message }, { status: 500 });
        }

        branches?.forEach((branch) => branchNames.set(branch.id, branch.name));
    }

    return NextResponse.json({
        users: (users || []).map((user) => ({
            ...user,
            branch_name: user.branch_id ? branchNames.get(user.branch_id) || null : null,
        })),
    });
}

function cleanUserPayload(body: Record<string, unknown>) {
    return {
        email: String(body.email || '').trim(),
        name: String(body.name || '').trim(),
        role: String(body.role || '').trim(),
        phone_number: String(body.phone_number || '').trim(),
        address: String(body.address || '').trim(),
        profile_image: String(body.profile_image || '').trim(),
        branch_id: body.branch_id ? String(body.branch_id) : null,
    };
}

function validateUserPayload(payload: ReturnType<typeof cleanUserPayload>) {
    if (!payload.name) return 'Full name is required.';
    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return 'Enter a valid email address.';
    if (!VALID_ROLES.includes(payload.role)) return 'Select a valid role.';
    return null;
}

export async function POST(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (!canManageUsers(auth.role)) {
        return NextResponse.json({ error: 'Only school admins can create users.' }, { status: 403 });
    }

    const payload = cleanUserPayload(await request.json());
    const validationError = validateUserPayload(payload);
    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data, error } = await auth.supabase
        .from('user_profiles')
        .insert(payload)
        .select(USER_COLUMNS)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data }, { status: 201 });
}
