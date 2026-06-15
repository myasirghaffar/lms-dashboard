import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';

const USER_COLUMNS = 'id, auth_user_id, email, name, role, phone_number, address, profile_image, branch_id, created_at, updated_at';
const VALID_ROLES = ['SUPER_ADMIN', 'ADMIN', 'BRANCH_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'];

const canManageUsers = (role?: string) => role === 'SUPER_ADMIN' || role === 'BRANCH_ADMIN';

function cleanUserPayload(body: Record<string, unknown>) {
    const payload: Record<string, string | null> = {};

    if (body.email !== undefined) payload.email = String(body.email).trim();
    if (body.name !== undefined) payload.name = String(body.name).trim();
    if (body.role !== undefined) payload.role = String(body.role).trim();
    if (body.phone_number !== undefined) payload.phone_number = String(body.phone_number).trim();
    if (body.address !== undefined) payload.address = String(body.address).trim();
    if (body.profile_image !== undefined) payload.profile_image = String(body.profile_image).trim();
    if (body.branch_id !== undefined) payload.branch_id = body.branch_id ? String(body.branch_id) : null;

    return payload;
}

function validateUserPayload(payload: Record<string, string | null>) {
    if (payload.name !== undefined && !payload.name) return 'Full name is required.';
    if (payload.email !== undefined && (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))) {
        return 'Enter a valid email address.';
    }
    if (payload.role !== undefined && (!payload.role || !VALID_ROLES.includes(payload.role))) return 'Select a valid role.';
    return null;
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (!canManageUsers(auth.role)) {
        return NextResponse.json({ error: 'Only school admins can update users.' }, { status: 403 });
    }

    const { id } = await params;
    const payload = cleanUserPayload(await request.json());
    const validationError = validateUserPayload(payload);
    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data, error } = await auth.supabase
        .from('user_profiles')
        .update(payload)
        .eq('id', id)
        .select(USER_COLUMNS)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data.role === 'BRANCH_ADMIN') {
        const { error: branchError } = await auth.supabase
            .from('branches')
            .update({ principal_name: data.name })
            .eq('principal_profile_id', id);

        if (branchError) {
            return NextResponse.json({ error: branchError.message }, { status: 500 });
        }
    }

    return NextResponse.json({ user: data });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (!canManageUsers(auth.role)) {
        return NextResponse.json({ error: 'Only school admins can delete users.' }, { status: 403 });
    }

    const { id } = await params;
    const { error: branchError } = await auth.supabase
        .from('branches')
        .update({ principal_profile_id: null, principal_name: '' })
        .eq('principal_profile_id', id);

    if (branchError) {
        return NextResponse.json({ error: branchError.message }, { status: 500 });
    }

    const { error } = await auth.supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
