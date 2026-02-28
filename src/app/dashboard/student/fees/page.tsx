'use client';

import React, { useMemo } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import FeeSlipPreview from '@/components/fees/FeeSlipPreview';
import studentsData from '@/data/students.json';
import { FeeLineItem, FeeParticularId, FeeStudent } from '@/types/fees';
import { useAuth } from '@/context/AuthContext';

const buildItemsForStudent = (student: FeeStudent | null): FeeLineItem[] => [
  { id: 'MONTHLY_FEE', label: 'Monthly Fee', amount: student?.monthlyFee ?? 0 },
  { id: 'ADMISSION_FEE', label: 'Admission Fee', amount: 0 },
  { id: 'EXTRA_COACHING_FEE', label: 'Extra Coaching Fee', amount: 0 },
  { id: 'REGISTRATION_FEE', label: 'Registration Fee', amount: 0 },
  { id: 'PAPER_FUND', label: 'Paper Fund', amount: 0 },
  { id: 'BOOKS', label: 'Books', amount: 0 },
  { id: 'UNIFORM', label: 'Uniform', amount: 0 },
  { id: 'FINE', label: 'Fine', amount: 0 },
  { id: 'OTHERS', label: 'Others', amount: 0 },
  { id: 'PREVIOUS_BALANCE', label: 'Previous Balance', amount: student?.previousBalance ?? 0 },
  { id: 'DISCOUNT', label: 'Discount', amount: 0 },
];

export default function StudentFeesPage() {
  const { user } = useAuth();
  const feeStudents = studentsData as unknown as FeeStudent[];

  const myStudent = useMemo(() => {
    if (!user) return null;
    const linked = feeStudents.find((s) => s.userId === user.id);
    return linked ?? null;
  }, [feeStudents, user]);

  const items = useMemo(
    () => buildItemsForStudent(myStudent),
    [myStudent],
  );

  const total = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (item.id === ('DISCOUNT' as FeeParticularId)) {
          return sum - Math.max(0, item.amount);
        }
        return sum + Math.max(0, item.amount);
      }, 0),
    [items],
  );

  const deposit = 0;
  const due = Math.max(0, total - deposit);

  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="My Fee Challan" />

        {!myStudent ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-purple-50/40 px-4 py-6 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-purple-950/20 dark:text-gray-300">
            No fee profile is linked to your account yet. Please contact the school administrator.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Current Fee Status
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Review your latest fee challan. You can print or download it for record keeping.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Student
                    </p>
                    <p className="mt-1 font-medium text-gray-900 dark:text-white">
                      {myStudent.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Reg ID: <span className="font-mono">{myStudent.id}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-semibold text-rose-600 dark:text-rose-400">
                      Rs. {due.toLocaleString()} Due
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total payable: Rs. {Math.max(0, total).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <FeeSlipPreview
                student={myStudent}
                month="Current Month"
                date={new Date().toISOString().slice(0, 10)}
                items={items}
                total={total}
                deposit={deposit}
                due={due}
              />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
