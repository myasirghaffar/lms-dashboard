'use client';

import React, { useMemo } from "react";
import Button from "@/components/ui/button/Button";

interface FeesSummaryProps {
  total: number;
  deposit: number;
  onDepositChange: (value: number) => void;
  onReset: () => void;
}

const FeesSummary: React.FC<FeesSummaryProps> = ({
  total,
  deposit,
  onDepositChange,
  onReset,
}) => {
  const { due, status, statusColor, badgeClasses, showOverpayWarning } =
    useMemo(() => {
      const safeTotal = Math.max(0, total);
      const safeDeposit = Math.max(0, deposit);
      const rawDue = safeTotal - safeDeposit;
      const effectiveDue = Math.max(0, rawDue);

      let statusText = "Pending";
      let color = "text-amber-600 dark:text-amber-400";
      let badge =
        "bg-amber-50 text-amber-700 ring-1 ring-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800/60";

      if (safeTotal === 0) {
        statusText = "Draft";
        color = "text-gray-500 dark:text-gray-400";
        badge =
          "bg-gray-50 text-gray-600 ring-1 ring-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700";
      } else if (effectiveDue === 0 && safeTotal > 0) {
        statusText = "Paid";
        color = "text-emerald-600 dark:text-emerald-400";
        badge =
          "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800/60";
      } else if (effectiveDue > 0) {
        statusText = "Due";
        color = "text-rose-600 dark:text-rose-400";
        badge =
          "bg-rose-50 text-rose-700 ring-1 ring-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-800/60";
      }

      const overpayWarning = safeDeposit > safeTotal && safeTotal > 0;

      return {
        due: effectiveDue,
        status: statusText,
        statusColor: color,
        badgeClasses: badge,
        showOverpayWarning: overpayWarning,
      };
    }, [total, deposit]);

  const handleDepositChange = (value: string) => {
    const numeric = Number(value.replace(/[^0-9.-]/g, ""));
    if (Number.isNaN(numeric)) {
      onDepositChange(0);
      return;
    }
    onDepositChange(Math.max(0, Math.floor(numeric)));
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/60 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            Collection Summary
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review total payable, record deposit, and verify outstanding balance.
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses}`}
        >
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Total Payable
            </p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              Rs. {Math.max(0, total).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-200">
              Deposit Amount (Received Now)
            </label>
            <input
              type="number"
              min={0}
              value={Number.isNaN(deposit) ? "" : deposit}
              onChange={(e) => handleDepositChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-right text-sm text-gray-900 shadow-xs focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-purple-500 dark:focus:ring-purple-500/30"
              placeholder="Enter deposit amount"
            />
            {showOverpayWarning && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                Deposit exceeds total payable. Please double-check the amount.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl bg-purple-50/60 p-4 dark:bg-purple-950/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
              Due Balance
            </span>
            <span
              className={`text-lg font-semibold ${
                status === "Paid"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : status === "Due"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-gray-800 dark:text-gray-100"
              }`}
            >
              Rs. {due.toLocaleString()}
            </span>
          </div>
          <p className={`text-xs ${statusColor}`}>
            {status === "Paid"
              ? "Payment is fully settled for this slip."
              : status === "Due"
              ? "Student has an outstanding balance. Please inform the guardian."
              : "Fill in fee details and deposit amount to generate a final slip."}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={onReset}
              className="text-xs font-medium"
            >
              Reset Form
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesSummary;

