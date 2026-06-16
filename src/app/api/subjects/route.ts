import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';
import { canManageAcademics, getCurrentProfile, jsonError } from '@/lib/academicApi';

const SUBJECT_COLUMNS = 'id, legacy_id, name, description, class_id, teacher_profile_id, branch_id, created_at, updated_at';

function cleanSubjectPayload(body: Record<string, unknown>) {
    return {
        name: String(body.name || '').trim(),
        description: String(body.description || '').trim(),
        class_id: body.class_id ? String(body.class_id) : null,
        teacher_profile_id: body.teacher_profile_id ? String(body.teacher_profile_id) : null,
        branch_id: body.branch_id ? String(body.branch_id) : null,
    };
}

function validateSubjectPayload(payload: ReturnType<typeof cleanSubjectPayload>) {
    if (!payload.name) return 'Subject name is required.';
    if (!payload.class_id) return 'Class is required.';
    return null;
}

async function decorateSubjects(auth: Exclude<Awaited<ReturnType<typeof requireUser>>, { error: string; status: 401 }>, subjects: any[]) {
    const classIds = [...new Set(subjects.map((item) => item.class_id).filter(Boolean))];
    const teacherIds = [...new Set(subjects.map((item) => item.teacher_profile_id).filter(Boolean))];
    const branchIds = [...new Set(subjects.map((item) => item.branch_id).filter(Boolean))];

    const [
        { data: classes, error: classError },
        { data: teachers, error: teacherError },
        { data: branches, error: branchError },
    ] = await Promise.all([
        classIds.length ? auth.supabase.from('classes').select('id, name').in('id', classIds) : Promise.resolve({ data: [], error: null }),
        teacherIds.length ? auth.supabase.from('user_profiles').select('id, name').in('id', teacherIds) : Promise.resolve({ data: [], error: null }),
        branchIds.length ? auth.supabase.from('branches').select('id, name').in('id', branchIds) : Promise.resolve({ data: [], error: null }),
    ]);

    if (classError) throw new Error(classError.message);
    if (teacherError) throw new Error(teacherError.message);
    if (branchError) throw new Error(branchError.message);

    const classesById = new Map((classes || []).map((item) => [item.id, item.name]));
    const teachersById = new Map((teachers || []).map((item) => [item.id, item.name]));
    const branchesById = new Map((branches || []).map((item) => [item.id, item.name]));

    return subjects.map((item) => ({
        ...item,
        class_name: item.class_id ? classesById.get(item.class_id) || null : null,
        teacher_name: item.teacher_profile_id ? teachersById.get(item.teacher_profile_id) || null : null,
        branch_name: item.branch_id ? branchesById.get(item.branch_id) || null : null,
    }));
}

export async function GET(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const profile = await getCurrentProfile(auth);
        let query = auth.supabase.from('subjects').select(SUBJECT_COLUMNS).order('name', { ascending: true });

        if (auth.role === 'TEACHER' && profile?.id) query = query.eq('teacher_profile_id', profile.id);

        if (auth.role === 'STUDENT' && profile?.id) {
            const { data: student, error: studentError } = await auth.supabase
                .from('students')
                .select('class_id')
                .eq('user_profile_id', profile.id)
                .maybeSingle();
            if (studentError) throw new Error(studentError.message);
            if (!student?.class_id) return NextResponse.json({ subjects: [] });
            query = query.eq('class_id', student.class_id);
        }

        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return NextResponse.json({ subjects: await decorateSubjects(auth, data || []) });
    } catch (error) {
        return jsonError(error, 'Unable to load subjects.');
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
    if (!canManageAcademics(auth.role)) return NextResponse.json({ error: 'Only school admins can create subjects.' }, { status: 403 });

    const payload = cleanSubjectPayload(await request.json());
    const validationError = validateSubjectPayload(payload);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    if (!payload.branch_id && payload.class_id) {
        const { data: cls } = await auth.supabase.from('classes').select('branch_id').eq('id', payload.class_id).maybeSingle();
        payload.branch_id = cls?.branch_id || null;
    }

    const { data, error } = await auth.supabase.from('subjects').insert(payload).select(SUBJECT_COLUMNS).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    try {
        const [created] = await decorateSubjects(auth, [data]);
        return NextResponse.json({ subject: created }, { status: 201 });
    } catch (decorateError) {
        return jsonError(decorateError, 'Subject created but could not be loaded.');
    }
}
