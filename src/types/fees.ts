export interface FeeStudent {
  id: string; // Registration ID / local student id
  userId?: string;
  parentId?: string;
  name: string;
  fatherName: string;
  class: string;
  rollNumber?: string;
  branchId?: string | null;
  branchName?: string | null;
  branchAddress?: string | null;
  branchPhone?: string | null;
  branchEmail?: string | null;
  parentName?: string | null;
  previousBalance: number;
  monthlyFee: number;
}

export type FeeParticularId =
  | "MONTHLY_FEE"
  | "ADMISSION_FEE"
  | "EXTRA_COACHING_FEE"
  | "REGISTRATION_FEE"
  | "PAPER_FUND"
  | "BOOKS"
  | "UNIFORM"
  | "FINE"
  | "OTHERS"
  | "PREVIOUS_BALANCE"
  | "DISCOUNT";

export interface FeeLineItem {
  id: FeeParticularId;
  label: string;
  amount: number;
}

export interface FeeFormValues {
  month: string;
  date: string; // ISO format YYYY-MM-DD
  dueDate: string;
  validityDate: string;
  items: FeeLineItem[];
  deposit: number;
}

export interface FeeChallanRecord {
  id: string;
  challan_number: string;
  student_id: string;
  parent_profile_id: string | null;
  branch_id: string | null;
  class_id: string | null;
  fee_month: string;
  issue_date: string;
  due_date: string;
  validity_date: string;
  subtotal: number;
  discount_amount: number;
  deposit_amount: number;
  total_amount: number;
  due_amount: number;
  late_fee_amount: number;
  payable_after_due_date: number;
  status: 'draft' | 'issued' | 'partial' | 'paid' | 'cancelled' | 'overdue';
  notes: string;
  created_by_profile_id: string | null;
  created_at: string;
  updated_at: string;
  student: FeeStudent;
  items: FeeLineItem[];
  payments?: FeePaymentRecord[];
}

export interface FeeChallanPayload {
  student_ids: string[];
  fee_month: string;
  issue_date: string;
  due_date: string;
  validity_date: string;
  items: FeeLineItem[];
  deposit_amount: number;
  notes?: string;
}

export type FeePaymentMethod = 'cash' | 'bank_transfer' | 'card' | 'cheque' | 'online' | 'other';

export interface FeePaymentRecord {
  id: string;
  receipt_number: string;
  challan_id: string;
  student_id: string;
  parent_profile_id: string | null;
  branch_id: string | null;
  class_id: string | null;
  amount: number;
  payment_method: FeePaymentMethod;
  payment_date: string;
  received_from: string;
  reference_number: string;
  notes: string;
  received_by_profile_id: string | null;
  received_by_name?: string | null;
  created_at: string;
  updated_at: string;
  challan?: FeeChallanRecord;
}

export interface FeePaymentPayload {
  challan_id: string;
  amount: number;
  payment_method: FeePaymentMethod;
  payment_date: string;
  received_from?: string;
  reference_number?: string;
  notes?: string;
}
