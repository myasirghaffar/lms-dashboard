import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';
import { getCurrentProfile } from '@/lib/academicApi';

const STUDENT_COLUMNS = 'id, legacy_id, user_profile_id, parent_profile_id, branch_id, class_id, roll_number, father_name, previous_balance, monthly_fee, created_at, updated_at';
const PROFILE_COLUMNS = 'id, email, name, phone_number, address, profile_image';

async function decorateChildren(
  auth: Exclude<Awaited<ReturnType<typeof requireUser>>, { error: string; status: 401 }>,
  students: any[],
) {
  if (!students.length) return [];

  const profileIds = [...new Set(students.map((student) => student.user_profile_id).filter(Boolean))];
  const branchIds = [...new Set(students.map((student) => student.branch_id).filter(Boolean))];
  const classIds = [...new Set(students.map((student) => student.class_id).filter(Boolean))];
  const studentIds = students.map((student) => student.id);

  const [
    { data: profiles, error: profileError },
    { data: branches, error: branchError },
    { data: classes, error: classError },
    { data: attendanceRecords, error: attendanceError },
    { data: challans, error: challanError },
  ] = await Promise.all([
    profileIds.length ? auth.supabase.from('user_profiles').select(PROFILE_COLUMNS).in('id', profileIds) : Promise.resolve({ data: [], error: null }),
    branchIds.length ? auth.supabase.from('branches').select('id, name, address, phone_number, email').in('id', branchIds) : Promise.resolve({ data: [], error: null }),
    classIds.length ? auth.supabase.from('classes').select('id, name, teacher_profile_id').in('id', classIds) : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? auth.supabase
          .from('attendance_records')
          .select('student_id, status, marked_at, attendance_sessions(attendance_date)')
          .in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? auth.supabase
          .from('fee_challans')
          .select('student_id, due_amount, fee_month, due_date, status')
          .in('student_id', studentIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (profileError) throw new Error(profileError.message);
  if (branchError) throw new Error(branchError.message);
  if (classError) throw new Error(classError.message);
  if (attendanceError) throw new Error(attendanceError.message);
  if (challanError) throw new Error(challanError.message);

  const teacherProfileIds = [...new Set((classes || []).map((classRecord) => classRecord.teacher_profile_id).filter(Boolean))];
  const { data: teachers, error: teacherError } = teacherProfileIds.length
    ? await auth.supabase.from('user_profiles').select('id, name').in('id', teacherProfileIds)
    : { data: [], error: null };
  if (teacherError) throw new Error(teacherError.message);

  const profilesById = new Map((profiles || []).map((profile) => [profile.id, profile]));
  const branchesById = new Map((branches || []).map((branch) => [branch.id, branch]));
  const classesById = new Map((classes || []).map((classRecord) => [classRecord.id, classRecord]));
  const teachersById = new Map((teachers || []).map((teacher) => [teacher.id, teacher.name]));

  const attendanceByStudent = new Map<string, any[]>();
  (attendanceRecords || []).forEach((record) => {
    const rows = attendanceByStudent.get(record.student_id) || [];
    rows.push(record);
    attendanceByStudent.set(record.student_id, rows);
  });

  const challansByStudent = new Map<string, any[]>();
  (challans || []).forEach((challan) => {
    const rows = challansByStudent.get(challan.student_id) || [];
    rows.push(challan);
    challansByStudent.set(challan.student_id, rows);
  });

  return students.map((student) => {
    const profile = profilesById.get(student.user_profile_id);
    const branch = student.branch_id ? branchesById.get(student.branch_id) : null;
    const classRecord = student.class_id ? classesById.get(student.class_id) : null;
    const attendance = attendanceByStudent.get(student.id) || [];
    const presentCount = attendance.filter((record) => record.status === 'PRESENT' || record.status === 'LATE').length;
    const attendancePercentage = attendance.length ? Math.round((presentCount / attendance.length) * 100) : null;
    const sortedAttendance = [...attendance].sort((a, b) => {
      const aDate = a.attendance_sessions?.attendance_date || a.marked_at || '';
      const bDate = b.attendance_sessions?.attendance_date || b.marked_at || '';
      return bDate.localeCompare(aDate);
    });
    const latestAttendance = sortedAttendance[0] || null;
    const studentChallans = challansByStudent.get(student.id) || [];
    const feeDue = studentChallans.reduce((sum, challan) => sum + Number(challan.due_amount || 0), 0);
    const nextFee = [...studentChallans].sort((a, b) => String(a.due_date || '').localeCompare(String(b.due_date || '')))[0] || null;

    return {
      ...student,
      previous_balance: Number(student.previous_balance || 0),
      monthly_fee: Number(student.monthly_fee || 0),
      name: profile?.name || 'Unknown Student',
      email: profile?.email || 'N/A',
      phone_number: profile?.phone_number || null,
      address: profile?.address || null,
      profile_image: profile?.profile_image || null,
      class_name: classRecord?.name || null,
      class_teacher_name: classRecord?.teacher_profile_id ? teachersById.get(classRecord.teacher_profile_id) || null : null,
      branch_name: branch?.name || null,
      branch_address: branch?.address || null,
      branch_phone_number: branch?.phone_number || null,
      branch_email: branch?.email || null,
      attendance_total: attendance.length,
      attendance_percentage: attendancePercentage,
      latest_attendance_status: latestAttendance?.status || null,
      latest_attendance_date: latestAttendance?.attendance_sessions?.attendance_date || null,
      fee_due: feeDue,
      next_fee_month: nextFee?.fee_month || null,
      next_fee_due_date: nextFee?.due_date || null,
    };
  });
}

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.role !== 'PARENT') {
    return NextResponse.json({ error: 'Only parents can view linked children.' }, { status: 403 });
  }

  try {
    const profile = await getCurrentProfile(auth);
    if (!profile?.id) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const { data: students, error } = await auth.supabase
      .from('students')
      .select(STUDENT_COLUMNS)
      .eq('parent_profile_id', profile.id)
      .order('roll_number', { ascending: true });

    if (error) throw new Error(error.message);
    return NextResponse.json({ children: await decorateChildren(auth, students || []) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load children.' }, { status: 500 });
  }
}
