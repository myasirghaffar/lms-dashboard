export type BranchStatus = 'active' | 'disabled';

export interface BranchRecord {
    id: string;
    legacy_id: string | null;
    name: string;
    address: string;
    phone_number: string;
    email: string;
    principal_name: string;
    principal_profile_id: string | null;
    status: BranchStatus;
    created_at: string;
    updated_at: string;
}

export interface BranchFormValues {
    name: string;
    address: string;
    phone_number: string;
    email: string;
    principal_name: string;
    principal_profile_id?: string | null;
    status: BranchStatus;
}
