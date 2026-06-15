import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';

const TEACHER_COLUMNS = 'id, user_profile_id, branch_id, specialization, created_at, updated_at';
const PROFILE_COLUMNS = 'id, email, name, phone_number, address, profile_image';

const canView = (role?: string) => role === 'SUPER_ADMIN' || role === 'BRANCH_ADMIN';

export async function GET(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (!canView(auth.role)) {
        return NextResponse.json({ error: 'Only school admins can view teachers.' }, { status: 403 });
    }

    const { data: teachers, error } = await auth.supabase
        .from('teachers')
        .select(TEACHER_COLUMNS)
        .order('created_at', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const profileIds = [...new Set((teachers || []).map((teacher) => teacher.user_profile_id))];
    const branchIds = [...new Set((teachers || []).map((teacher) => teacher.branch_id).filter(Boolean))];

    const [{ data: profiles, error: profileError }, { data: branches, error: branchError }] = await Promise.all([
        profileIds.length
            ? auth.supabase.from('user_profiles').select(PROFILE_COLUMNS).in('id', profileIds)
            : Promise.resolve({ data: [], error: null }),
        branchIds.length
            ? auth.supabase.from('branches').select('id, name').in('id', branchIds)
            : Promise.resolve({ data: [], error: null }),
    ]);

    if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
    }
    if (branchError) {
        return NextResponse.json({ error: branchError.message }, { status: 500 });
    }

    const profilesById = new Map((profiles || []).map((profile) => [profile.id, profile]));
    const branchesById = new Map((branches || []).map((branch) => [branch.id, branch.name]));

    return NextResponse.json({
        teachers: (teachers || []).map((teacher) => {
            const profile = profilesById.get(teacher.user_profile_id);

            return {
                ...teacher,
                branch_name: teacher.branch_id ? branchesById.get(teacher.branch_id) || null : null,
                name: profile?.name || 'Unknown',
                email: profile?.email || 'N/A',
                phone_number: profile?.phone_number || null,
                address: profile?.address || null,
                profile_image: profile?.profile_image || null,
            };
        }),
    });
}

function cleanTeacherPayload(body: Record<string, unknown>) {
    return {
        name: String(body.name || '').trim(),
        email: String(body.email || '').trim(),
        phone_number: String(body.phone_number || '').trim(),
        address: String(body.address || '').trim(),
        profile_image: String(body.profile_image || '').trim(),
        branch_id: body.branch_id ? String(body.branch_id) : null,
        specialization: String(body.specialization || '').trim(),
    };
}

function validateTeacherPayload(payload: ReturnType<typeof cleanTeacherPayload>) {
    if (!payload.name) return 'Teacher name is required.';
    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return 'Enter a valid email address.';
    return null;
}

export async function POST(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (!canView(auth.role)) {
        return NextResponse.json({ error: 'Only school admins can create teachers.' }, { status: 403 });
    }

    const payload = cleanTeacherPayload(await request.json());
    const validationError = validateTeacherPayload(payload);
    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data: profile, error: profileError } = await auth.supabase
        .from('user_profiles')
        .insert({
            name: payload.name,
            email: payload.email,
            role: 'TEACHER',
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

    const { data: teacher, error: teacherError } = await auth.supabase
        .from('teachers')
        .insert({
            user_profile_id: profile.id,
            branch_id: payload.branch_id,
            specialization: payload.specialization,
        })
        .select(TEACHER_COLUMNS)
        .single();

    if (teacherError) {
        await auth.supabase.from('user_profiles').delete().eq('id', profile.id);
        return NextResponse.json({ error: teacherError.message }, { status: 500 });
    }

    return NextResponse.json({
        teacher: {
            ...teacher,
            branch_name: null,
            name: profile.name,
            email: profile.email,
            phone_number: profile.phone_number,
            address: profile.address,
            profile_image: profile.profile_image,
        },
    }, { status: 201 });
}
