'use client';

import React from 'react';
import type { FeePaymentRecord } from '@/types/fees';

interface FeePaymentHistoryProps {
  payments?: FeePaymentRecord[];
  selectedPaymentId?: string | null;
  onSelectPayment: (payment: FeePaymentRecord) => void;
}

function formatCurrency(value: number) {
  return Math.max(0, Number(value || 0)).toLocaleString();
}

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const FeePaymentHistory: React.FC<FeePaymentHistoryProps> = ({ payments = [], selectedPaymentId, onSelectPayment }) => {
  if (!payments.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        No payment receipt has been recorded for this challan yet.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm font-semibold text-gray-900 dark:text-white">Payment Receipts</p>
      <div className="mt-3 space-y-2">
        {payments.map((payment) => (
          <button
            key={payment.id}
            type="button"
            onClick={() => onSelectPayment(payment)}
            className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${
              selectedPaymentId === payment.id
                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300'
                : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
            }`}
          >
            <span className="block font-semibold">{payment.receipt_number}</span>
            <span>{formatDate(payment.payment_date)} · Rs. {formatCurrency(payment.amount)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeePaymentHistory;
