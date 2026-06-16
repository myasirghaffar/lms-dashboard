import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';
import { canManageAcademics } from '@/lib/academicApi';

const SUBJECT_COLUMNS = 'id, legacy_id, name, description, class_id, teacher_profile_id, branch_id, created_at, updated_at';

function cleanSubjectPayload(body: Record<string, unknown>) {
    const payload: Record<string, string | null> = {};
    if (body.name !== undefined) payload.name = String(body.name).trim();
    if (body.description !== undefined) payload.description = String(body.description).trim();
    if (body.class_id !== undefined) payload.class_id = body.class_id ? String(body.class_id) : null;
    if (body.teacher_profile_id !== undefined) payload.teacher_profile_id = body.teacher_profile_id ? String(body.teacher_profile_id) : null;
    if (body.branch_id !== undefined) payload.branch_id = body.branch_id ? String(body.branch_id) : null;
    return payload;
}

function validateSubjectPayload(payload: Record<string, string | null>) {
    if (payload.name !== undefined && !payload.name) return 'Subject name is required.';
    if (payload.class_id !== undefined && !payload.class_id) return 'Class is required.';
    return null;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    if (!canManageAcademics(auth.role)) return NextResponse.json({ error: 'Only school admins can update subjects.' }, { status: 403 });

    const { id } = await params;
    const payload = cleanSubjectPayload(await request.json());
    const validationError = validateSubjectPayload(payload);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    if (!payload.branch_id && payload.class_id) {
        const { data: cls } = await auth.supabase.from('classes').select('branch_id').eq('id', payload.class_id).maybeSingle();
        payload.branch_id = cls?.branch_id || null;
    }

    const { data, error } = await auth.supabase.from('subjects').update(payload).eq('id', id).select(SUBJECT_COLUMNS).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ subject: data });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    if (!canManageAcademics(auth.role)) return NextResponse.json({ error: 'Only school admins can delete subjects.' }, { status: 403 });

    const { id } = await params;
    const { error } = await auth.supabase.from('subjects').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
