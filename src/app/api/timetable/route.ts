import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';
import { canManageAcademics, getCurrentProfile, jsonError } from '@/lib/academicApi';

const TIMETABLE_COLUMNS = 'id, class_id, subject_id, teacher_profile_id, branch_id, day_of_week, start_time, end_time, room_number, created_at, updated_at';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function cleanTimetablePayload(body: Record<string, unknown>) {
    return {
        class_id: body.class_id ? String(body.class_id) : null,
        subject_id: body.subject_id ? String(body.subject_id) : null,
        teacher_profile_id: body.teacher_profile_id ? String(body.teacher_profile_id) : null,
        branch_id: body.branch_id ? String(body.branch_id) : null,
        day_of_week: String(body.day_of_week || '').trim(),
        start_time: String(body.start_time || '').trim(),
        end_time: String(body.end_time || '').trim(),
        room_number: String(body.room_number || '').trim(),
    };
}

function validateTimetablePayload(payload: ReturnType<typeof cleanTimetablePayload>) {
    if (!payload.class_id) return 'Class is required.';
    if (!payload.subject_id) return 'Subject is required.';
    if (!DAYS.includes(payload.day_of_week)) return 'Select a valid day.';
    if (!payload.start_time) return 'Start time is required.';
    if (!payload.end_time) return 'End time is required.';
    return null;
}

async function decorateEntries(auth: Exclude<Awaited<ReturnType<typeof requireUser>>, { error: string; status: 401 }>, entries: any[]) {
    const classIds = [...new Set(entries.map((item) => item.class_id).filter(Boolean))];
    const subjectIds = [...new Set(entries.map((item) => item.subject_id).filter(Boolean))];
    const teacherIds = [...new Set(entries.map((item) => item.teacher_profile_id).filter(Boolean))];
    const branchIds = [...new Set(entries.map((item) => item.branch_id).filter(Boolean))];

    const [
        { data: classes, error: classError },
        { data: subjects, error: subjectError },
        { data: teachers, error: teacherError },
        { data: branches, error: branchError },
    ] = await Promise.all([
        classIds.length ? auth.supabase.from('classes').select('id, name').in('id', classIds) : Promise.resolve({ data: [], error: null }),
        subjectIds.length ? auth.supabase.from('subjects').select('id, name').in('id', subjectIds) : Promise.resolve({ data: [], error: null }),
        teacherIds.length ? auth.supabase.from('user_profiles').select('id, name').in('id', teacherIds) : Promise.resolve({ data: [], error: null }),
        branchIds.length ? auth.supabase.from('branches').select('id, name').in('id', branchIds) : Promise.resolve({ data: [], error: null }),
    ]);

    if (classError) throw new Error(classError.message);
    if (subjectError) throw new Error(subjectError.message);
    if (teacherError) throw new Error(teacherError.message);
    if (branchError) throw new Error(branchError.message);

    const classesById = new Map((classes || []).map((item) => [item.id, item.name]));
    const subjectsById = new Map((subjects || []).map((item) => [item.id, item.name]));
    const teachersById = new Map((teachers || []).map((item) => [item.id, item.name]));
    const branchesById = new Map((branches || []).map((item) => [item.id, item.name]));

    return entries.map((item) => ({
        ...item,
        class_name: item.class_id ? classesById.get(item.class_id) || null : null,
        subject_name: item.subject_id ? subjectsById.get(item.subject_id) || null : null,
        teacher_name: item.teacher_profile_id ? teachersById.get(item.teacher_profile_id) || null : null,
        branch_name: item.branch_id ? branchesById.get(item.branch_id) || null : null,
    }));
}

export async function GET(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const profile = await getCurrentProfile(auth);
        let query = auth.supabase.from('timetable_entries').select(TIMETABLE_COLUMNS).order('day_of_week').order('start_time');

        if (auth.role === 'TEACHER' && profile?.id) query = query.eq('teacher_profile_id', profile.id);

        if (auth.role === 'STUDENT' && profile?.id) {
            const { data: student, error: studentError } = await auth.supabase
                .from('students')
                .select('class_id')
                .eq('user_profile_id', profile.id)
                .maybeSingle();
            if (studentError) throw new Error(studentError.message);
            if (!student?.class_id) return NextResponse.json({ entries: [], timetable: [] });
            query = query.eq('class_id', student.class_id);
        }

        const classId = request.nextUrl.searchParams.get('class_id');
        if (classId && canManageAcademics(auth.role)) query = query.eq('class_id', classId);

        const teacherProfileId = request.nextUrl.searchParams.get('teacher_profile_id');
        if (teacherProfileId && canManageAcademics(auth.role)) query = query.eq('teacher_profile_id', teacherProfileId);

        const branchId = request.nextUrl.searchParams.get('branch_id');
        if (branchId && canManageAcademics(auth.role)) query = query.eq('branch_id', branchId);

        const dayOfWeek = request.nextUrl.searchParams.get('day_of_week');
        if (dayOfWeek && canManageAcademics(auth.role) && DAYS.includes(dayOfWeek)) query = query.eq('day_of_week', dayOfWeek);

        const { data, error } = await query;
        if (error) throw new Error(error.message);
        const entries = await decorateEntries(auth, data || []);
        return NextResponse.json({ entries, timetable: entries });
    } catch (error) {
        return jsonError(error, 'Unable to load timetable.');
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    if (!canManageAcademics(auth.role)) return NextResponse.json({ error: 'Only school admins can create timetable entries.' }, { status: 403 });

    const payload = cleanTimetablePayload(await request.json());
    const validationError = validateTimetablePayload(payload);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    if ((!payload.branch_id || !payload.teacher_profile_id) && payload.subject_id) {
        const { data: subject } = await auth.supabase.from('subjects').select('branch_id, teacher_profile_id').eq('id', payload.subject_id).maybeSingle();
        payload.branch_id = payload.branch_id || subject?.branch_id || null;
        payload.teacher_profile_id = payload.teacher_profile_id || subject?.teacher_profile_id || null;
    }

    const { data, error } = await auth.supabase.from('timetable_entries').insert(payload).select(TIMETABLE_COLUMNS).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    try {
        const [created] = await decorateEntries(auth, [data]);
        return NextResponse.json({ entry: created }, { status: 201 });
    } catch (decorateError) {
        return jsonError(decorateError, 'Timetable entry created but could not be loaded.');
    }
}
