import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';
import { canManageAcademics } from '@/lib/academicApi';

const TIMETABLE_COLUMNS = 'id, class_id, subject_id, teacher_profile_id, branch_id, day_of_week, start_time, end_time, room_number, created_at, updated_at';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function cleanTimetablePayload(body: Record<string, unknown>) {
    const payload: Record<string, string | null> = {};
    if (body.class_id !== undefined) payload.class_id = body.class_id ? String(body.class_id) : null;
    if (body.subject_id !== undefined) payload.subject_id = body.subject_id ? String(body.subject_id) : null;
    if (body.teacher_profile_id !== undefined) payload.teacher_profile_id = body.teacher_profile_id ? String(body.teacher_profile_id) : null;
    if (body.branch_id !== undefined) payload.branch_id = body.branch_id ? String(body.branch_id) : null;
    if (body.day_of_week !== undefined) payload.day_of_week = String(body.day_of_week).trim();
    if (body.start_time !== undefined) payload.start_time = String(body.start_time).trim();
    if (body.end_time !== undefined) payload.end_time = String(body.end_time).trim();
    if (body.room_number !== undefined) payload.room_number = String(body.room_number).trim();
    return payload;
}

function validateTimetablePayload(payload: Record<string, string | null>) {
    if (payload.class_id !== undefined && !payload.class_id) return 'Class is required.';
    if (payload.subject_id !== undefined && !payload.subject_id) return 'Subject is required.';
    if (payload.day_of_week !== undefined && (!payload.day_of_week || !DAYS.includes(payload.day_of_week))) return 'Select a valid day.';
    if (payload.start_time !== undefined && !payload.start_time) return 'Start time is required.';
    if (payload.end_time !== undefined && !payload.end_time) return 'End time is required.';
    return null;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    if (!canManageAcademics(auth.role)) return NextResponse.json({ error: 'Only school admins can update timetable entries.' }, { status: 403 });

    const { id } = await params;
    const payload = cleanTimetablePayload(await request.json());
    const validationError = validateTimetablePayload(payload);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const { data, error } = await auth.supabase.from('timetable_entries').update(payload).eq('id', id).select(TIMETABLE_COLUMNS).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ entry: data });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    if (!canManageAcademics(auth.role)) return NextResponse.json({ error: 'Only school admins can delete timetable entries.' }, { status: 403 });

    const { id } = await params;
    const { error } = await auth.supabase.from('timetable_entries').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
