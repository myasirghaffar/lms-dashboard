export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type AttendanceSessionStatus = 'draft' | 'submitted';

export interface AttendanceStudentRecord {
  id: string;
  roll_number: string;
  name: string;
  father_name: string | null;
  status: AttendanceStatus;
  remarks: string;
}

export interface AttendanceSessionRecord {
  id: string;
  class_id: string;
  class_name: string | null;
  branch_id: string | null;
  branch_name: string | null;
  teacher_profile_id: string | null;
  teacher_name: string | null;
  attendance_date: string;
  status: AttendanceSessionStatus;
  notes: string;
  total_students: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  created_at: string;
  updated_at: string;
  students: AttendanceStudentRecord[];
}

export interface AttendanceSavePayload {
  class_id: string;
  attendance_date: string;
  status: AttendanceSessionStatus;
  notes?: string;
  records: Array<{
    student_id: string;
    status: AttendanceStatus;
    remarks?: string;
  }>;
}
