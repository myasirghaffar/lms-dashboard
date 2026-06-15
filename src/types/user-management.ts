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

export interface SchoolClassRecord {
    id: string;
    legacy_id: string | null;
    name: string;
    branch_id: string | null;
}
