import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';

const USER_COLUMNS = 'id, auth_user_id, email, name, role, phone_number, address, profile_image, branch_id, created_at, updated_at';
const STUDENT_COLUMNS = 'id, legacy_id, user_profile_id, parent_profile_id, branch_id, class_id, roll_number';
const PROFILE_COLUMNS = 'id, email, name';

const canView = (role?: string) => role === 'SUPER_ADMIN' || role === 'BRANCH_ADMIN';

export async function GET(request: NextRequest) {
    const auth = await requireUser(request);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (!canView(auth.role)) {
        return NextResponse.json({ error: 'Only school admins can view parents.' }, { status: 403 });
    }

    const { data: parents, error: parentError } = await auth.supabase
        .from('user_profiles')
        .select(USER_COLUMNS)
        .eq('role', 'PARENT')
        .order('created_at', { ascending: true });

    if (parentError) {
        return NextResponse.json({ error: parentError.message }, { status: 500 });
    }

    const parentIds = (parents || []).map((parent) => parent.id);
    if (parentIds.length === 0) {
        return NextResponse.json({ parents: [] });
    }

    const { data: students, error: studentError } = await auth.supabase
        .from('students')
        .select(STUDENT_COLUMNS)
        .in('parent_profile_id', parentIds)
        .order('roll_number', { ascending: true });

    if (studentError) {
        return NextResponse.json({ error: studentError.message }, { status: 500 });
    }

    const studentProfileIds = [...new Set((students || []).map((student) => student.user_profile_id).filter(Boolean))];
    const branchIds = [...new Set((students || []).map((student) => student.branch_id).filter(Boolean))];
    const classIds = [...new Set((students || []).map((student) => student.class_id).filter(Boolean))];

    const [
        { data: studentProfiles, error: profileError },
        { data: branches, error: branchError },
        { data: classes, error: classError },
    ] = await Promise.all([
        studentProfileIds.length
            ? auth.supabase.from('user_profiles').select(PROFILE_COLUMNS).in('id', studentProfileIds)
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

    const profilesById = new Map((studentProfiles || []).map((profile) => [profile.id, profile]));
    const branchesById = new Map((branches || []).map((branch) => [branch.id, branch.name]));
    const classesById = new Map((classes || []).map((schoolClass) => [schoolClass.id, schoolClass.name]));
    const childrenByParent = new Map<string, unknown[]>();

    (students || []).forEach((student) => {
        if (!student.parent_profile_id) return;
        const profile = profilesById.get(student.user_profile_id);
        const children = childrenByParent.get(student.parent_profile_id) || [];
        children.push({
            id: student.id,
            legacy_id: student.legacy_id,
            roll_number: student.roll_number,
            class_name: student.class_id ? classesById.get(student.class_id) || null : null,
            branch_name: student.branch_id ? branchesById.get(student.branch_id) || null : null,
            name: profile?.name || 'Unknown Student',
            email: profile?.email || 'N/A',
        });
        childrenByParent.set(student.parent_profile_id, children);
    });

    return NextResponse.json({
        parents: (parents || []).map((parent) => ({
            ...parent,
            children: childrenByParent.get(parent.id) || [],
        })),
    });
}
