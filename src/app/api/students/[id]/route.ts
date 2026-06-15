import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';

const STUDENT_COLUMNS = 'id, legacy_id, user_profile_id, parent_profile_id, branch_id, class_id, roll_number, father_name, previous_balance, monthly_fee, created_at, updated_at';
const PROFILE_COLUMNS = 'id, email, name, phone_number, address, profile_image';

const canManage = (role?: string) => role === 'SUPER_ADMIN' || role === 'BRANCH_ADMIN';

function cleanStudentPayload(body: Record<string, unknown>) {
    const profile: Record<string, string | null> = {};
    const student: Record<string, string | number | null> = {};

    if (body.name !== undefined) profile.name = String(body.name).trim();
    if (body.email !== undefined) profile.email = String(body.email).trim();
    if (body.phone_number !== undefined) profile.phone_number = String(body.phone_number).trim();
    if (body.address !== undefined) profile.address = String(body.address).trim();
    if (body.profile_image !== undefined) profile.profile_image = String(body.profile_image).trim();
    if (body.branch_id !== undefined) {
        const branchId = body.branch_id ? String(body.branch_id) : null;
        profile.branch_id = branchId;
        student.branch_id = branchId;
    }
    if (body.class_id !== undefined) student.class_id = body.class_id ? String(body.class_id) : null;
    if (body.parent_profile_id !== undefined) student.parent_profile_id = body.parent_profile_id ? String(body.parent_profile_id) : null;
    if (body.roll_number !== undefined) student.roll_number = String(body.roll_number).trim();
    if (body.father_name !== undefined) student.father_name = String(body.father_name).trim();
    if (body.previous_balance !== undefined) student.previous_balance = Number(body.previous_balance || 0);
    if (body.monthly_fee !== undefined) student.monthly_fee = Number(body.monthly_fee || 0);

    return { profile, student };
}

function validateStudentPayload(profile: Record<string, string | null>, student: Record<string, string | number | null>) {
    if (profile.name !== undefined && !profile.name) return 'Student name is required.';
    if (profile.email !== undefined && (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))) return 'Enter a valid email address.';
    if (student.roll_number !== undefined && !student.roll_number) return 'Roll number is required.';
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
        return NextResponse.json({ error: 'Only school admins can update students.' }, { status: 403 });
    }

    const { id } = await params;
    const { profile, student } = cleanStudentPayload(await request.json());
    const validationError = validateStudentPayload(profile, student);
    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { data: existing, error: existingError } = await auth.supabase
        .from('students')
        .select(STUDENT_COLUMNS)
        .eq('id', id)
        .single();

    if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });

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

    let updatedStudent = existing;
    if (Object.keys(student).length) {
        const { data, error } = await auth.supabase
            .from('students')
            .update(student)
            .eq('id', id)
            .select(STUDENT_COLUMNS)
            .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        updatedStudent = data;
    }

    return NextResponse.json({
        student: {
            ...updatedStudent,
            previous_balance: Number(updatedStudent.previous_balance || 0),
            monthly_fee: Number(updatedStudent.monthly_fee || 0),
            branch_name: null,
            class_name: null,
            parent_name: null,
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
        return NextResponse.json({ error: 'Only school admins can delete students.' }, { status: 403 });
    }

    const { id } = await params;
    const { data: student, error: studentError } = await auth.supabase
        .from('students')
        .select('user_profile_id')
        .eq('id', id)
        .single();

    if (studentError) return NextResponse.json({ error: studentError.message }, { status: 500 });

    const { error } = await auth.supabase
        .from('user_profiles')
        .delete()
        .eq('id', student.user_profile_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
}
