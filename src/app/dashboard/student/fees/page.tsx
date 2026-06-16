'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import FeeSlipPreview from '@/components/fees/FeeSlipPreview';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { FeeChallanRecord } from '@/types/fees';

type ChallansResponse = { challans: FeeChallanRecord[] };

export default function StudentFeesPage() {
  const [challans, setChallans] = useState<FeeChallanRecord[]>([]);
  const [selectedChallanId, setSelectedChallanId] = useState<string | null>(null);
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

  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="My Fee Challan" />

        {isLoading ? (
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-5 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Loading your linked fee challans...
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-5 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {errorMessage}
          </div>
        ) : !challans.length ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            No fee challan is linked to your account yet. Please contact the school office.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {challans.map((challan) => (
                <button
                  key={challan.id}
                  type="button"
                  onClick={() => setSelectedChallanId(challan.id)}
                  className={`rounded-lg border px-3 py-2 text-left text-xs ${
                    challan.id === selectedChallan?.id
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300'
                      : 'border-gray-200 bg-white text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300'
                  }`}
                >
                  <span className="block font-semibold">{challan.fee_month}</span>
                  <span>{challan.challan_number}</span>
                </button>
              ))}
            </div>

            {selectedChallan && (
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
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
