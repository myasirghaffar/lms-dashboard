export interface FeeStudent {
  id: string; // Registration ID / local student id
  userId?: string;
  parentId?: string;
  name: string;
  fatherName: string;
  class: string;
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
  items: FeeLineItem[];
  deposit: number;
}

