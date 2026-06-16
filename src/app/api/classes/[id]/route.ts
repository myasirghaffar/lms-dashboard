import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';
import { canManageAcademics } from '@/lib/academicApi';

const CLASS_COLUMNS = 'id, legacy_id, name, branch_id, teacher_profile_id, capacity, room_number, created_at, updated_at';

function cleanClassPayload(body: Record<string, unknown>) {
    const payload: Record<string, string | number | null> = {};
    if (body.name !== undefined) payload.name = String(body.name).trim();
    if (body.branch_id !== undefined) payload.branch_id = body.branch_id ? String(body.branch_id) : null;
    if (body.teacher_profile_id !== undefined) payload.teacher_profile_id = body.teacher_profile_id ? String(body.teacher_profile_id) : null;
    if (body.capacity !== undefined) payload.capacity = body.capacity === '' || body.capacity === null ? null : Number(body.capacity);
    if (body.room_number !== undefined) payload.room_number = String(body.room_number).trim();
    return payload;
}

function validateClassPayload(payload: Record<string, string | number | null>) {
    if (payload.name !== undefined && !payload.name) return 'Class name is required.';
    if (payload.capacity !== undefined && payload.capacity !== null && (!Number.isFinite(payload.capacity) || Number(payload.capacity) < 0)) {
        return 'Capacity must be a valid number.';
    }
    return null;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    if (!canManageAcademics(auth.role)) return NextResponse.json({ error: 'Only school admins can update classes.' }, { status: 403 });

    const { id } = await params;
    const payload = cleanClassPayload(await request.json());
    const validationError = validateClassPayload(payload);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const { data, error } = await auth.supabase.from('classes').update(payload).eq('id', id).select(CLASS_COLUMNS).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ class: data });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    if (!canManageAcademics(auth.role)) return NextResponse.json({ error: 'Only school admins can delete classes.' }, { status: 403 });

    const { id } = await params;
    const { error } = await auth.supabase.from('classes').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
