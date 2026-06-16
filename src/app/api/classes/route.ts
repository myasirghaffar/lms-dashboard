import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';
import { canManageAcademics, getCurrentProfile, jsonError } from '@/lib/academicApi';

const CLASS_COLUMNS = 'id, legacy_id, name, branch_id, teacher_profile_id, capacity, room_number, created_at, updated_at';

function cleanClassPayload(body: Record<string, unknown>) {
    return {
        name: String(body.name || '').trim(),
        branch_id: body.branch_id ? String(body.branch_id) : null,
        teacher_profile_id: body.teacher_profile_id ? String(body.teacher_profile_id) : null,
        capacity: body.capacity === undefined || body.capacity === '' ? null : Number(body.capacity),
        room_number: String(body.room_number || '').trim(),
    };
}

function validateClassPayload(payload: ReturnType<typeof cleanClassPayload>) {
    if (!payload.name) return 'Class name is required.';
    if (payload.capacity !== null && (!Number.isFinite(payload.capacity) || payload.capacity < 0)) return 'Capacity must be a valid number.';
    return null;
}

async function decorateClasses(auth: Exclude<Awaited<ReturnType<typeof requireUser>>, { error: string; status: 401 }>, classes: any[]) {
    const branchIds = [...new Set(classes.map((item) => item.branch_id).filter(Boolean))];
    const teacherIds = [...new Set(classes.map((item) => item.teacher_profile_id).filter(Boolean))];
    const classIds = classes.map((item) => item.id);

    const [
        { data: branches, error: branchError },
        { data: teachers, error: teacherError },
        { data: students, error: studentError },
    ] = await Promise.all([
        branchIds.length ? auth.supabase.from('branches').select('id, name').in('id', branchIds) : Promise.resolve({ data: [], error: null }),
        teacherIds.length ? auth.supabase.from('user_profiles').select('id, name').in('id', teacherIds) : Promise.resolve({ data: [], error: null }),
        classIds.length ? auth.supabase.from('students').select('class_id').in('class_id', classIds) : Promise.resolve({ data: [], error: null }),
    ]);

    if (branchError) throw new Error(branchError.message);
    if (teacherError) throw new Error(teacherError.message);
    if (studentError) throw new Error(studentError.message);

    const branchesById = new Map((branches || []).map((branch) => [branch.id, branch.name]));
    const teachersById = new Map((teachers || []).map((teacher) => [teacher.id, teacher.name]));
    const studentCounts = new Map<string, number>();
    (students || []).forEach((student) => {
        if (!student.class_id) return;
        studentCounts.set(student.class_id, (studentCounts.get(student.class_id) || 0) + 1);
    });

    return classes.map((item) => ({
        ...item,
        branch_name: item.branch_id ? branchesById.get(item.branch_id) || null : null,
        teacher_name: item.teacher_profile_id ? teachersById.get(item.teacher_profile_id) || null : null,
        student_count: studentCounts.get(item.id) || 0,
    }));
}

export async function GET(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const profile = await getCurrentProfile(auth);
        let query = auth.supabase.from('classes').select(CLASS_COLUMNS).order('name', { ascending: true });

        if (auth.role === 'TEACHER' && profile?.id) {
            query = query.eq('teacher_profile_id', profile.id);
        }

        if (auth.role === 'STUDENT' && profile?.id) {
            const { data: student, error: studentError } = await auth.supabase
                .from('students')
                .select('class_id')
                .eq('user_profile_id', profile.id)
                .maybeSingle();
            if (studentError) throw new Error(studentError.message);
            if (!student?.class_id) return NextResponse.json({ classes: [] });
            query = query.eq('id', student.class_id);
        }

        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return NextResponse.json({ classes: await decorateClasses(auth, data || []) });
    } catch (error) {
        return jsonError(error, 'Unable to load classes.');
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (!canManageAcademics(auth.role)) {
        return NextResponse.json({ error: 'Only school admins can create classes.' }, { status: 403 });
    }

    const payload = cleanClassPayload(await request.json());
    const validationError = validateClassPayload(payload);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const { data, error } = await auth.supabase
        .from('classes')
        .insert(payload)
        .select(CLASS_COLUMNS)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    try {
        const [created] = await decorateClasses(auth, [data]);
        return NextResponse.json({ class: created }, { status: 201 });
    } catch (decorateError) {
        return jsonError(decorateError, 'Class created but could not be loaded.');
    }
}
