import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';
import type { BranchFormValues } from '@/types/branches';

const BRANCH_COLUMNS = 'id, legacy_id, name, address, phone_number, email, principal_name, status, created_at, updated_at';

function cleanBranchPayload(body: Partial<BranchFormValues>) {
    return {
        name: String(body.name || '').trim(),
        address: String(body.address || '').trim(),
        phone_number: String(body.phone_number || '').trim(),
        email: String(body.email || '').trim(),
        principal_name: String(body.principal_name || '').trim(),
        status: body.status === 'disabled' ? 'disabled' : 'active',
    };
}

function validateBranchPayload(payload: ReturnType<typeof cleanBranchPayload>) {
    if (!payload.name) return 'Branch name is required.';
    if (!payload.address) return 'Branch address is required.';
    if (!payload.phone_number) return 'Phone number is required.';
    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        return 'Enter a valid email address.';
    }
    return null;
}

export async function GET(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data, error } = await auth.supabase
        .from('branches')
        .select(BRANCH_COLUMNS)
        .order('created_at', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ branches: data });
}

export async function POST(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (auth.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Only super admins can create branches.' }, { status: 403 });
    }

    const payload = cleanBranchPayload(await request.json());
    const validationError = validateBranchPayload(payload);

    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data, error } = await auth.supabase
        .from('branches')
        .insert(payload)
        .select(BRANCH_COLUMNS)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ branch: data }, { status: 201 });
}
