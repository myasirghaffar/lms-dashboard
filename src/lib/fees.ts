import type { FeeLineItem, FeeStudent } from '@/types/fees';
import type { StudentManagementRecord } from '@/types/user-management';

export const MONTH_OPTIONS: string[] = [
  'January 2026',
  'February 2026',
  'March 2026',
  'April 2026',
  'May 2026',
  'June 2026',
  'July 2026',
  'August 2026',
  'September 2026',
  'October 2026',
  'November 2026',
  'December 2026',
];

export function getDefaultFeeDates() {
  const today = new Date();
  const issueDate = today.toISOString().slice(0, 10);
  const dueDateValue = new Date(today);
  dueDateValue.setDate(today.getDate() + 10);
  const validityDateValue = new Date(today);
  validityDateValue.setDate(today.getDate() + 17);

  return {
    issueDate,
    dueDate: dueDateValue.toISOString().slice(0, 10),
    validityDate: validityDateValue.toISOString().slice(0, 10),
  };
}

export function toFeeStudent(student: StudentManagementRecord): FeeStudent {
  return {
    id: student.id,
    userId: student.user_profile_id,
    parentId: student.parent_profile_id || undefined,
    name: student.name,
    fatherName: student.father_name || student.parent_name || 'N/A',
    class: student.class_name || 'N/A',
    rollNumber: student.roll_number,
    branchId: student.branch_id,
    branchName: student.branch_name,
    branchAddress: student.branch_address,
    branchPhone: student.branch_phone_number,
    branchEmail: student.branch_email,
    parentName: student.parent_name,
    previousBalance: Number(student.previous_balance || 0),
    monthlyFee: Number(student.monthly_fee || 0),
  };
}

export function buildItemsForStudent(student: FeeStudent | null): FeeLineItem[] {
  return [
    { id: 'MONTHLY_FEE', label: 'School Fee', amount: student?.monthlyFee ?? 0 },
    { id: 'ADMISSION_FEE', label: 'Admission Fee', amount: 0 },
    { id: 'EXTRA_COACHING_FEE', label: 'Extra Coaching Fee', amount: 0 },
    { id: 'REGISTRATION_FEE', label: 'Registration Fee', amount: 0 },
    { id: 'PAPER_FUND', label: 'Paper Fund', amount: 0 },
    { id: 'BOOKS', label: 'Books', amount: 0 },
    { id: 'UNIFORM', label: 'Uniform', amount: 0 },
    { id: 'FINE', label: 'Fine', amount: 0 },
    { id: 'OTHERS', label: 'Others', amount: 0 },
    { id: 'PREVIOUS_BALANCE', label: 'Arrears', amount: student?.previousBalance ?? 0 },
    { id: 'DISCOUNT', label: 'Discount', amount: 0 },
  ];
}

export function calculateFeeTotals(items: FeeLineItem[], deposit: number) {
  const subtotal = items.reduce((sum, item) => {
    if (item.id === 'DISCOUNT') return sum;
    return sum + Math.max(0, Number(item.amount || 0));
  }, 0);
  const discount = items.reduce((sum, item) => {
    if (item.id !== 'DISCOUNT') return sum;
    return sum + Math.max(0, Number(item.amount || 0));
  }, 0);
  const total = Math.max(0, subtotal - discount);
  const safeDeposit = Math.max(0, Number(deposit || 0));
  const due = Math.max(0, total - safeDeposit);
  const lateFee = total > 0 ? Math.round(total * 0.05) : 0;

  return {
    subtotal,
    discount,
    total,
    deposit: safeDeposit,
    due,
    lateFee,
    payableAfterDueDate: due + lateFee,
  };
}
