import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';

const TEACHER_COLUMNS = 'id, user_profile_id, branch_id, specialization, created_at, updated_at';
const PROFILE_COLUMNS = 'id, email, name, phone_number, address, profile_image';

const canManage = (role?: string) => role === 'SUPER_ADMIN' || role === 'BRANCH_ADMIN';

function cleanTeacherPayload(body: Record<string, unknown>) {
    const profile: Record<string, string | null> = {};
    const teacher: Record<string, string | null> = {};

    if (body.name !== undefined) profile.name = String(body.name).trim();
    if (body.email !== undefined) profile.email = String(body.email).trim();
    if (body.phone_number !== undefined) profile.phone_number = String(body.phone_number).trim();
    if (body.address !== undefined) profile.address = String(body.address).trim();
    if (body.profile_image !== undefined) profile.profile_image = String(body.profile_image).trim();
    if (body.branch_id !== undefined) {
        const branchId = body.branch_id ? String(body.branch_id) : null;
        profile.branch_id = branchId;
        teacher.branch_id = branchId;
    }
    if (body.specialization !== undefined) teacher.specialization = String(body.specialization).trim();

    return { profile, teacher };
}

function validateTeacherPayload(profile: Record<string, string | null>) {
    if (profile.name !== undefined && !profile.name) return 'Teacher name is required.';
    if (profile.email !== undefined && (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))) return 'Enter a valid email address.';
    return null;
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (!canManage(auth.role)) {
        return NextResponse.json({ error: 'Only school admins can update teachers.' }, { status: 403 });
    }

    const { id } = await params;
    const { profile, teacher } = cleanTeacherPayload(await request.json());
    const validationError = validateTeacherPayload(profile);
    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data: existing, error: existingError } = await auth.supabase
        .from('teachers')
        .select(TEACHER_COLUMNS)
        .eq('id', id)
        .single();

    if (existingError) {
        return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    let updatedProfile = null;
    if (Object.keys(profile).length) {
        const { data, error } = await auth.supabase
            .from('user_profiles')
            .update(profile)
            .eq('id', existing.user_profile_id)
            .select(PROFILE_COLUMNS)
            .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        updatedProfile = data;
    } else {
        const { data, error } = await auth.supabase
            .from('user_profiles')
            .select(PROFILE_COLUMNS)
            .eq('id', existing.user_profile_id)
            .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        updatedProfile = data;
    }

    let updatedTeacher = existing;
    if (Object.keys(teacher).length) {
        const { data, error } = await auth.supabase
            .from('teachers')
            .update(teacher)
            .eq('id', id)
            .select(TEACHER_COLUMNS)
            .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        updatedTeacher = data;
    }

    return NextResponse.json({
        teacher: {
            ...updatedTeacher,
            branch_name: null,
            name: updatedProfile.name,
            email: updatedProfile.email,
            phone_number: updatedProfile.phone_number,
            address: updatedProfile.address,
            profile_image: updatedProfile.profile_image,
        },
    });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (!canManage(auth.role)) {
        return NextResponse.json({ error: 'Only school admins can delete teachers.' }, { status: 403 });
    }

    const { id } = await params;
    const { data: teacher, error: teacherError } = await auth.supabase
        .from('teachers')
        .select('user_profile_id')
        .eq('id', id)
        .single();

    if (teacherError) {
        return NextResponse.json({ error: teacherError.message }, { status: 500 });
    }

    const { error } = await auth.supabase
        .from('user_profiles')
        .delete()
        .eq('id', teacher.user_profile_id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
