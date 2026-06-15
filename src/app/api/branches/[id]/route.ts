import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';
import type { BranchFormValues } from '@/types/branches';

const BRANCH_COLUMNS = 'id, legacy_id, name, address, phone_number, email, principal_name, status, created_at, updated_at';

function cleanBranchPayload(body: Partial<BranchFormValues>) {
    const payload: Partial<BranchFormValues> = {};

    if (body.name !== undefined) payload.name = String(body.name).trim();
    if (body.address !== undefined) payload.address = String(body.address).trim();
    if (body.phone_number !== undefined) payload.phone_number = String(body.phone_number).trim();
    if (body.email !== undefined) payload.email = String(body.email).trim();
    if (body.principal_name !== undefined) payload.principal_name = String(body.principal_name).trim();
    if (body.status !== undefined) payload.status = body.status === 'disabled' ? 'disabled' : 'active';

    return payload;
}

function validateBranchPayload(payload: Partial<BranchFormValues>) {
    if (payload.name !== undefined && !payload.name) return 'Branch name is required.';
    if (payload.address !== undefined && !payload.address) return 'Branch address is required.';
    if (payload.phone_number !== undefined && !payload.phone_number) return 'Phone number is required.';
    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        return 'Enter a valid email address.';
    }
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
    if (auth.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Only super admins can update branches.' }, { status: 403 });
    }

    const { id } = await params;
    const payload = cleanBranchPayload(await request.json());
    const validationError = validateBranchPayload(payload);

    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data, error } = await auth.supabase
        .from('branches')
        .update(payload)
        .eq('id', id)
        .select(BRANCH_COLUMNS)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ branch: data });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (auth.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Only super admins can delete branches.' }, { status: 403 });
    }

    const { id } = await params;
    const { error } = await auth.supabase
        .from('branches')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
