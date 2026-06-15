import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';
import type { BranchFormValues } from '@/types/branches';

const BRANCH_COLUMNS = 'id, legacy_id, name, address, phone_number, email, principal_name, principal_profile_id, status, created_at, updated_at';

function cleanBranchPayload(body: Partial<BranchFormValues>) {
    return {
        name: String(body.name || '').trim(),
        address: String(body.address || '').trim(),
        phone_number: String(body.phone_number || '').trim(),
        email: String(body.email || '').trim(),
        principal_name: String(body.principal_name || '').trim(),
        principal_profile_id: body.principal_profile_id ? String(body.principal_profile_id) : null,
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

async function applyPrincipalName(auth: Awaited<ReturnType<typeof requireUser>>, payload: ReturnType<typeof cleanBranchPayload>) {
    if (!payload.principal_profile_id) return payload;
    if ('error' in auth) return payload;

    const { data, error } = await auth.supabase
        .from('user_profiles')
        .select('name, role')
        .eq('id', payload.principal_profile_id)
        .single();

    if (error || data?.role !== 'BRANCH_ADMIN') {
        throw new Error('Select a valid principal.');
    }

    return {
        ...payload,
        principal_name: data.name,
    };
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

    const cleanedPayload = cleanBranchPayload(await request.json());
    const validationError = validateBranchPayload(cleanedPayload);

    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
    }

    let payload = cleanedPayload;
    try {
        payload = await applyPrincipalName(auth, cleanedPayload);
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid principal.' }, { status: 400 });
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
