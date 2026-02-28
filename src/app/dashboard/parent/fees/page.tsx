'use client';

import React, { useMemo, useState } from 'react';
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

export default function ParentFeesPage() {
  const { user } = useAuth();
  const feeStudents = studentsData as unknown as FeeStudent[];

  const myChildren = useMemo(() => {
    if (!user) return [];
    return feeStudents.filter((s) => s.parentId === user.id);
  }, [feeStudents, user]);

  const [selectedChildId, setSelectedChildId] = useState<string | null>(
    myChildren[0]?.id ?? null,
  );

  const selectedChild = useMemo(
    () => myChildren.find((c) => c.id === selectedChildId) ?? myChildren[0] ?? null,
    [myChildren, selectedChildId],
  );

  const items = useMemo(
    () => buildItemsForStudent(selectedChild),
    [selectedChild],
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

  const combinedTotal = useMemo(
    () =>
      myChildren.reduce(
        (acc, child) =>
          acc + Math.max(0, child.monthlyFee + child.previousBalance),
        0,
      ),
    [myChildren],
  );

  return (
    <ProtectedRoute allowedRoles={['PARENT']}>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Children Fee Status" />

        {!myChildren.length ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-purple-50/40 px-4 py-6 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-purple-950/20 dark:text-gray-300">
            No children are linked to your account yet. Please contact the school administrator.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="space-y-4 xl:col-span-2">
              <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Children Overview
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Select a child to preview their fee challan. You can print or download slips for record.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {myChildren.map((child) => {
                    const childItems = buildItemsForStudent(child);
                    const childTotal = childItems.reduce((sum, item) => {
                      if (item.id === ('DISCOUNT' as FeeParticularId)) {
                        return sum - Math.max(0, item.amount);
                      }
                      return sum + Math.max(0, item.amount);
                    }, 0);

                    const childDue = childTotal;

                    const isActive = child.id === selectedChild?.id;

                    return (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => setSelectedChildId(child.id)}
                        className={`flex flex-col items-start rounded-2xl border px-4 py-3 text-left text-sm transition ${
                          isActive
                            ? 'border-purple-500 bg-purple-50 shadow-sm dark:border-purple-500 dark:bg-purple-950/40'
                            : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60 dark:hover:bg-gray-900'
                        }`}
                      >
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {child.name}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          Reg ID: <span className="font-mono">{child.id}</span>
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          Class: {child.class}
                        </p>
                        <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                          Due: Rs. {childDue.toLocaleString()}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-xl bg-purple-50/60 px-4 py-3 text-sm text-gray-700 dark:bg-purple-950/30 dark:text-gray-200">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Combined Monthly Payable
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    Rs. {combinedTotal.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This is a simple combined view of current month fee plus previous balances
                    for all linked children.
                  </p>
                </div>
              </div>
            </div>

            <div className="xl:col-span-1">
              {selectedChild && (
                <FeeSlipPreview
                  student={selectedChild}
                  month="Current Month"
                  date={new Date().toISOString().slice(0, 10)}
                  items={items}
                  total={total}
                  deposit={deposit}
                  due={due}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
