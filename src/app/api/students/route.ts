import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';

const STUDENT_COLUMNS = 'id, legacy_id, user_profile_id, parent_profile_id, branch_id, class_id, roll_number, father_name, previous_balance, monthly_fee, created_at, updated_at';
const PROFILE_COLUMNS = 'id, email, name, phone_number, address, profile_image';

const canView = (role?: string) => role === 'SUPER_ADMIN' || role === 'BRANCH_ADMIN';

export async function GET(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (!canView(auth.role)) {
        return NextResponse.json({ error: 'Only school admins can view students.' }, { status: 403 });
    }

    const { data: students, error } = await auth.supabase
        .from('students')
        .select(STUDENT_COLUMNS)
        .order('created_at', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const profileIds = [
        ...new Set(
            (students || [])
                .flatMap((student) => [student.user_profile_id, student.parent_profile_id])
                .filter(Boolean)
        ),
    ];
    const branchIds = [...new Set((students || []).map((student) => student.branch_id).filter(Boolean))];
    const classIds = [...new Set((students || []).map((student) => student.class_id).filter(Boolean))];

    const [
        { data: profiles, error: profileError },
        { data: branches, error: branchError },
        { data: classes, error: classError },
    ] = await Promise.all([
        profileIds.length
            ? auth.supabase.from('user_profiles').select(PROFILE_COLUMNS).in('id', profileIds)
            : Promise.resolve({ data: [], error: null }),
        branchIds.length
            ? auth.supabase.from('branches').select('id, name').in('id', branchIds)
            : Promise.resolve({ data: [], error: null }),
        classIds.length
            ? auth.supabase.from('classes').select('id, name').in('id', classIds)
            : Promise.resolve({ data: [], error: null }),
    ]);

    if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
    }
    if (branchError) {
        return NextResponse.json({ error: branchError.message }, { status: 500 });
    }
    if (classError) {
        return NextResponse.json({ error: classError.message }, { status: 500 });
    }

    const profilesById = new Map((profiles || []).map((profile) => [profile.id, profile]));
    const branchesById = new Map((branches || []).map((branch) => [branch.id, branch.name]));
    const classesById = new Map((classes || []).map((schoolClass) => [schoolClass.id, schoolClass.name]));

    return NextResponse.json({
        students: (students || []).map((student) => {
            const profile = profilesById.get(student.user_profile_id);
            const parent = student.parent_profile_id ? profilesById.get(student.parent_profile_id) : null;

            return {
                ...student,
                previous_balance: Number(student.previous_balance || 0),
                monthly_fee: Number(student.monthly_fee || 0),
                branch_name: student.branch_id ? branchesById.get(student.branch_id) || null : null,
                class_name: student.class_id ? classesById.get(student.class_id) || null : null,
                parent_name: parent?.name || null,
                name: profile?.name || 'Unknown',
                email: profile?.email || 'N/A',
                phone_number: profile?.phone_number || null,
                address: profile?.address || null,
                profile_image: profile?.profile_image || null,
            };
        }),
    });
}

function cleanStudentPayload(body: Record<string, unknown>) {
    return {
        name: String(body.name || '').trim(),
        email: String(body.email || '').trim(),
        phone_number: String(body.phone_number || '').trim(),
        address: String(body.address || '').trim(),
        profile_image: String(body.profile_image || '').trim(),
        branch_id: body.branch_id ? String(body.branch_id) : null,
        class_id: body.class_id ? String(body.class_id) : null,
        parent_profile_id: body.parent_profile_id ? String(body.parent_profile_id) : null,
        roll_number: String(body.roll_number || '').trim(),
        father_name: String(body.father_name || '').trim(),
        previous_balance: Number(body.previous_balance || 0),
        monthly_fee: Number(body.monthly_fee || 0),
    };
}

function validateStudentPayload(payload: ReturnType<typeof cleanStudentPayload>) {
    if (!payload.name) return 'Student name is required.';
    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return 'Enter a valid email address.';
    if (!payload.roll_number) return 'Roll number is required.';
    return null;
}

export async function POST(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (!canView(auth.role)) {
        return NextResponse.json({ error: 'Only school admins can create students.' }, { status: 403 });
    }

    const payload = cleanStudentPayload(await request.json());
    const validationError = validateStudentPayload(payload);
    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data: profile, error: profileError } = await auth.supabase
        .from('user_profiles')
        .insert({
            name: payload.name,
            email: payload.email,
            role: 'STUDENT',
            phone_number: payload.phone_number,
            address: payload.address,
            profile_image: payload.profile_image,
            branch_id: payload.branch_id,
        })
        .select(PROFILE_COLUMNS)
        .single();

    if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const { data: student, error: studentError } = await auth.supabase
        .from('students')
        .insert({
            user_profile_id: profile.id,
            parent_profile_id: payload.parent_profile_id,
            branch_id: payload.branch_id,
            class_id: payload.class_id,
            roll_number: payload.roll_number,
            father_name: payload.father_name,
            previous_balance: payload.previous_balance,
            monthly_fee: payload.monthly_fee,
        })
        .select(STUDENT_COLUMNS)
        .single();

    if (studentError) {
        await auth.supabase.from('user_profiles').delete().eq('id', profile.id);
        return NextResponse.json({ error: studentError.message }, { status: 500 });
    }

    return NextResponse.json({
        student: {
            ...student,
            previous_balance: Number(student.previous_balance || 0),
            monthly_fee: Number(student.monthly_fee || 0),
            branch_name: null,
            class_name: null,
            parent_name: null,
            name: profile.name,
            email: profile.email,
            phone_number: profile.phone_number,
            address: profile.address,
            profile_image: profile.profile_image,
        },
    }, { status: 201 });
}
