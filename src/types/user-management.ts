export type SystemUserRole = 'SUPER_ADMIN' | 'ADMIN' | 'BRANCH_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface SystemUserRecord {
    id: string;
    auth_user_id: string | null;
    email: string;
    name: string;
    role: SystemUserRole;
    phone_number: string | null;
    address: string | null;
    profile_image: string | null;
    branch_id: string | null;
    branch_name?: string | null;
    created_at: string;
    updated_at: string;
}

export interface TeacherManagementRecord {
    id: string;
    user_profile_id: string;
    branch_id: string | null;
    branch_name: string | null;
    specialization: string | null;
    created_at: string;
    updated_at: string;
    name: string;
    email: string;
    phone_number: string | null;
    address: string | null;
    profile_image: string | null;
}

export interface StudentManagementRecord {
    id: string;
    legacy_id: string | null;
    user_profile_id: string;
    parent_profile_id: string | null;
    branch_id: string | null;
    branch_name: string | null;
    class_id: string | null;
    class_name: string | null;
    roll_number: string;
    father_name: string | null;
    parent_name: string | null;
    previous_balance: number;
    monthly_fee: number;
    created_at: string;
    updated_at: string;
    name: string;
    email: string;
    phone_number: string | null;
    address: string | null;
    profile_image: string | null;
}

export interface ParentChildRecord {
    id: string;
    legacy_id: string | null;
    roll_number: string;
    class_name: string | null;
    branch_name: string | null;
    name: string;
    email: string;
}

export interface ParentManagementRecord extends SystemUserRecord {
    children: ParentChildRecord[];
}

export interface SchoolClassRecord {
    id: string;
    legacy_id: string | null;
    name: string;
    branch_id: string | null;
    branch_name?: string | null;
    teacher_profile_id?: string | null;
    teacher_name?: string | null;
    capacity?: number | null;
    room_number?: string | null;
    student_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface SubjectRecord {
    id: string;
    legacy_id: string | null;
    name: string;
    description: string | null;
    class_id: string | null;
    class_name: string | null;
    teacher_profile_id: string | null;
    teacher_name: string | null;
    branch_id: string | null;
    branch_name: string | null;
    created_at: string;
    updated_at: string;
}

export interface TimetableEntryRecord {
    id: string;
    class_id: string | null;
    class_name: string | null;
    subject_id: string | null;
    subject_name: string | null;
    teacher_profile_id: string | null;
    teacher_name: string | null;
    branch_id: string | null;
    branch_name: string | null;
    day_of_week: string;
    start_time: string;
    end_time: string;
    room_number: string | null;
    created_at: string;
    updated_at: string;
}
