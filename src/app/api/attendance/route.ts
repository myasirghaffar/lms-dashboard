import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabaseServer';
import { getCurrentProfile } from '@/lib/academicApi';
import { summarizeAttendance } from '@/lib/attendance';
import type { AttendanceSavePayload, AttendanceStatus } from '@/types/attendance';

const SESSION_COLUMNS = 'id, class_id, branch_id, teacher_profile_id, attendance_date, status, notes, created_by_profile_id, created_at, updated_at';
const VALID_STATUSES: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];

function canManageAttendance(role?: string) {
  return role === 'SUPER_ADMIN' || role === 'BRANCH_ADMIN' || role === 'TEACHER';
}

function cleanDate(value: string | null) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : new Date().toISOString().slice(0, 10);
}

function cleanPayload(body: Partial<AttendanceSavePayload>): AttendanceSavePayload {
  return {
    class_id: String(body.class_id || '').trim(),
    attendance_date: cleanDate(String(body.attendance_date || '')),
    status: body.status === 'draft' ? 'draft' : 'submitted',
    notes: String(body.notes || '').trim(),
    records: Array.isArray(body.records)
      ? body.records.map((record) => ({
          student_id: String(record.student_id || '').trim(),
          status: VALID_STATUSES.includes(record.status as AttendanceStatus) ? (record.status as AttendanceStatus) : 'PRESENT',
          remarks: String(record.remarks || '').trim(),
        }))
      : [],
  };
}

function validatePayload(payload: AttendanceSavePayload) {
  if (!payload.class_id) return 'Class is required.';
  if (!payload.records.length) return 'At least one student attendance record is required.';
  if (payload.records.some((record) => !record.student_id)) return 'Every attendance row must include a student.';
  return null;
}

async function assertClassAccess(
  auth: Exclude<Awaited<ReturnType<typeof requireUser>>, { error: string; status: 401 }>,
  classId: string,
  profileId?: string,
) {
  const { data: classRecord, error } = await auth.supabase
    .from('classes')
    .select('id, name, branch_id, teacher_profile_id')
    .eq('id', classId)
    .single();

  if (error) throw new Error(error.message);

  if (auth.role === 'TEACHER' && classRecord.teacher_profile_id !== profileId) {
    throw new Error('You can mark attendance only for your assigned classes.');
  }

  if (!canManageAttendance(auth.role)) {
    throw new Error('You are not allowed to manage attendance.');
  }

  return classRecord;
}

async function getVisibleClassIds(
  auth: Exclude<Awaited<ReturnType<typeof requireUser>>, { error: string; status: 401 }>,
  profileId?: string,
) {
  if (auth.role === 'TEACHER' && profileId) {
    const { data, error } = await auth.supabase.from('classes').select('id').eq('teacher_profile_id', profileId);
    if (error) throw new Error(error.message);
    return (data || []).map((item) => item.id);
  }

  if (auth.role === 'STUDENT' && profileId) {
    const { data, error } = await auth.supabase.from('students').select('class_id').eq('user_profile_id', profileId).maybeSingle();
    if (error) throw new Error(error.message);
    return data?.class_id ? [data.class_id] : [];
  }

  if (auth.role === 'PARENT' && profileId) {
    const { data, error } = await auth.supabase.from('students').select('class_id').eq('parent_profile_id', profileId);
    if (error) throw new Error(error.message);
    return [...new Set((data || []).map((item) => item.class_id).filter(Boolean))];
  }

  return null;
}

async function decorateSession(
  auth: Exclude<Awaited<ReturnType<typeof requireUser>>, { error: string; status: 401 }>,
  classId: string,
  attendanceDate: string,
  session: any | null,
) {
  const [
    { data: classRecord, error: classError },
    { data: students, error: studentError },
  ] = await Promise.all([
    auth.supabase.from('classes').select('id, name, branch_id, teacher_profile_id').eq('id', classId).single(),
    auth.supabase
      .from('students')
      .select('id, user_profile_id, roll_number, father_name, class_id')
      .eq('class_id', classId)
      .order('roll_number', { ascending: true }),
  ]);

  if (classError) throw new Error(classError.message);
  if (studentError) throw new Error(studentError.message);

  const profileIds = [...new Set((students || []).map((student) => student.user_profile_id).concat(classRecord.teacher_profile_id).filter(Boolean))];
  const sessionId = session?.id;

  const [
    { data: profiles, error: profileError },
    { data: branches, error: branchError },
    { data: records, error: recordError },
  ] = await Promise.all([
    profileIds.length ? auth.supabase.from('user_profiles').select('id, name').in('id', profileIds) : Promise.resolve({ data: [], error: null }),
    classRecord.branch_id ? auth.supabase.from('branches').select('id, name').eq('id', classRecord.branch_id) : Promise.resolve({ data: [], error: null }),
    sessionId ? auth.supabase.from('attendance_records').select('id, session_id, student_id, status, remarks, marked_at').eq('session_id', sessionId) : Promise.resolve({ data: [], error: null }),
  ]);

  if (profileError) throw new Error(profileError.message);
  if (branchError) throw new Error(branchError.message);
  if (recordError) throw new Error(recordError.message);

  const profilesById = new Map((profiles || []).map((profile) => [profile.id, profile.name]));
  const recordsByStudent = new Map((records || []).map((record) => [record.student_id, record]));

  const roster = (students || []).map((student) => {
    const record = recordsByStudent.get(student.id);
    return {
      id: student.id,
      roll_number: student.roll_number,
      name: profilesById.get(student.user_profile_id) || 'Unknown Student',
      father_name: student.father_name || null,
      status: (record?.status || 'PRESENT') as AttendanceStatus,
      remarks: record?.remarks || '',
    };
  });
  const summary = summarizeAttendance(roster);
  const branch = (branches || [])[0];

  return {
    id: session?.id || '',
    class_id: classRecord.id,
    class_name: classRecord.name,
    branch_id: classRecord.branch_id,
    branch_name: branch?.name || null,
    teacher_profile_id: classRecord.teacher_profile_id,
    teacher_name: classRecord.teacher_profile_id ? profilesById.get(classRecord.teacher_profile_id) || null : null,
    attendance_date: session?.attendance_date || attendanceDate,
    status: session?.status || 'draft',
    notes: session?.notes || '',
    total_students: summary.total,
    present_count: summary.present,
    absent_count: summary.absent,
    late_count: summary.late,
    excused_count: summary.excused,
    created_at: session?.created_at || '',
    updated_at: session?.updated_at || '',
    students: roster,
  };
}

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const profile = await getCurrentProfile(auth);
    if (!profile?.id) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const classId = request.nextUrl.searchParams.get('class_id');
    const attendanceDate = cleanDate(request.nextUrl.searchParams.get('date'));
    const visibleClassIds = await getVisibleClassIds(auth, profile.id);

    if (classId) {
      if (visibleClassIds && !visibleClassIds.includes(classId)) {
        return NextResponse.json({ error: 'You are not allowed to view this class attendance.' }, { status: 403 });
      }

      const { data: session, error } = await auth.supabase
        .from('attendance_sessions')
        .select(SESSION_COLUMNS)
        .eq('class_id', classId)
        .eq('attendance_date', attendanceDate)
        .maybeSingle();
      if (error) throw new Error(error.message);

      return NextResponse.json({ session: await decorateSession(auth, classId, attendanceDate, session) });
    }

    let query = auth.supabase.from('attendance_sessions').select(SESSION_COLUMNS).order('attendance_date', { ascending: false }).limit(50);
    if (visibleClassIds) {
      if (!visibleClassIds.length) return NextResponse.json({ sessions: [] });
      query = query.in('class_id', visibleClassIds);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const sessions = await Promise.all((data || []).map((session) => decorateSession(auth, session.class_id, session.attendance_date, session)));
    return NextResponse.json({ sessions });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load attendance.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const payload = cleanPayload(await request.json());
  const validationError = validatePayload(payload);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  try {
    const profile = await getCurrentProfile(auth);
    if (!profile?.id) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const classRecord = await assertClassAccess(auth, payload.class_id, profile.id);
    const studentIds = payload.records.map((record) => record.student_id);
    const { data: students, error: studentError } = await auth.supabase
      .from('students')
      .select('id')
      .eq('class_id', payload.class_id)
      .in('id', studentIds);

    if (studentError) throw new Error(studentError.message);
    if ((students || []).length !== studentIds.length) {
      return NextResponse.json({ error: 'Attendance includes a student outside the selected class.' }, { status: 400 });
    }

    const { data: session, error: sessionError } = await auth.supabase
      .from('attendance_sessions')
      .upsert(
        {
          class_id: classRecord.id,
          branch_id: classRecord.branch_id,
          teacher_profile_id: classRecord.teacher_profile_id || profile.id,
          attendance_date: payload.attendance_date,
          status: payload.status,
          notes: payload.notes || '',
          created_by_profile_id: profile.id,
        },
        { onConflict: 'class_id,attendance_date' },
      )
      .select(SESSION_COLUMNS)
      .single();

    if (sessionError) throw new Error(sessionError.message);

    const recordRows = payload.records.map((record) => ({
      session_id: session.id,
      student_id: record.student_id,
      status: record.status,
      remarks: record.remarks || '',
      marked_at: new Date().toISOString(),
    }));

    const { error: recordError } = await auth.supabase
      .from('attendance_records')
      .upsert(recordRows, { onConflict: 'session_id,student_id' });

    if (recordError) throw new Error(recordError.message);

    return NextResponse.json({ session: await decorateSession(auth, payload.class_id, payload.attendance_date, session) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to save attendance.' }, { status: 500 });
  }
}
