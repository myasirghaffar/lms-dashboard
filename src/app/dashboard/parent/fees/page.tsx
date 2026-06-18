'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import FeePaymentHistory from '@/components/fees/FeePaymentHistory';
import FeeSlipPreview from '@/components/fees/FeeSlipPreview';
import ThermalFeeReceipt from '@/components/fees/ThermalFeeReceipt';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { FeeChallanRecord } from '@/types/fees';

type ChallansResponse = { challans: FeeChallanRecord[] };

export default function ParentFeesPage() {
  const [challans, setChallans] = useState<FeeChallanRecord[]>([]);
  const [selectedChallanId, setSelectedChallanId] = useState<string | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadChallans = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const payload = await requestDashboardApi<ChallansResponse>('/api/fee-challans');
        if (!mounted) return;
        setChallans(payload.challans);
        setSelectedChallanId(payload.challans[0]?.id || null);
      } catch (error) {
        if (!mounted) return;
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load fee challans.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void loadChallans();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedChallan = challans.find((challan) => challan.id === selectedChallanId) || challans[0] || null;
  const selectedPayment = selectedChallan?.payments?.find((payment) => payment.id === selectedPaymentId) || selectedChallan?.payments?.[0] || null;

  useEffect(() => {
    setSelectedPaymentId(selectedChallan?.payments?.[0]?.id || null);
  }, [selectedChallan?.id, selectedChallan?.payments]);

  const childSummaries = useMemo(() => {
    const summaries = new Map<string, { name: string; total: number; count: number }>();
    challans.forEach((challan) => {
      const current = summaries.get(challan.student.id) || {
        name: challan.student.name,
        total: 0,
        count: 0,
      };
      current.total += challan.due_amount;
      current.count += 1;
      summaries.set(challan.student.id, current);
    });
    return [...summaries.entries()];
  }, [challans]);

  return (
    <ProtectedRoute allowedRoles={['PARENT']}>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Children Fee Status" />

        {isLoading ? (
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-5 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Loading linked children fee challans...
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-5 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {errorMessage}
          </div>
        ) : !challans.length ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            No challans are linked to your children yet. Please contact the school office.
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="min-w-0 space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Children Overview</p>
                <div className="mt-3 space-y-2">
                  {childSummaries.map(([studentId, summary]) => (
                    <div key={studentId} className="rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800">
                      <p className="font-medium text-gray-900 dark:text-white">{summary.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {summary.count} challan{summary.count === 1 ? '' : 's'} · Rs. {summary.total.toLocaleString()} due
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Challans</p>
                <div className="mt-3 space-y-2">
                  {challans.map((challan) => (
                    <button
                      key={challan.id}
                      type="button"
                      onClick={() => setSelectedChallanId(challan.id)}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-xs ${
                        challan.id === selectedChallan?.id
                          ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300'
                          : 'border-gray-200 bg-white text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
                      }`}
                    >
                      <span className="block font-semibold">{challan.student.name}</span>
                      <span>{challan.fee_month} · {challan.challan_number}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedChallan && (
              <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="min-w-0 overflow-hidden">
                  <FeeSlipPreview
                    challan={selectedChallan}
                    student={selectedChallan.student}
                    month={selectedChallan.fee_month}
                    date={selectedChallan.issue_date}
                    dueDate={selectedChallan.due_date}
                    validityDate={selectedChallan.validity_date}
                    items={selectedChallan.items}
                    total={selectedChallan.total_amount}
                    deposit={selectedChallan.deposit_amount}
                    due={selectedChallan.due_amount}
                  />
                </div>
                <div className="space-y-4">
                  <FeePaymentHistory
                    payments={selectedChallan.payments}
                    selectedPaymentId={selectedPayment?.id || null}
                    onSelectPayment={(payment) => setSelectedPaymentId(payment.id)}
                  />
                  <ThermalFeeReceipt payment={selectedPayment} challan={selectedChallan} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
