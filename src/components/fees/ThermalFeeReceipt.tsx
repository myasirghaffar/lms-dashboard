'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import Button from '@/components/ui/button/Button';
import type { FeeChallanRecord, FeePaymentRecord } from '@/types/fees';

interface ThermalFeeReceiptProps {
  payment: FeePaymentRecord | null;
  challan?: FeeChallanRecord | null;
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

function formatMethod(value?: string) {
  return (value || 'cash').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function receiptFileName(payment: FeePaymentRecord | null, challan?: FeeChallanRecord | null) {
  const studentName = challan?.student?.name || payment?.challan?.student?.name || 'Student';
  const receipt = payment?.receipt_number || 'Receipt';
  return `${studentName} ${receipt}`.replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim();
}

const ThermalFeeReceipt: React.FC<ThermalFeeReceiptProps> = ({ payment, challan }) => {
  const effectiveChallan = challan || payment?.challan || null;

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const previousTitle = document.title;
    document.title = receiptFileName(payment, effectiveChallan);
    document.body.classList.add('thermal-receipt-printing');

    const restoreTitle = () => {
      document.title = previousTitle;
      document.body.classList.remove('thermal-receipt-printing');
      window.removeEventListener('afterprint', restoreTitle);
    };

    window.addEventListener('afterprint', restoreTitle);
    window.print();
    window.setTimeout(restoreTitle, 1500);
  };

  if (!payment) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        Record a payment to generate the thermal receipt.
      </div>
    );
  }

  return (
    <div className="thermal-receipt-root space-y-3">
      <div className="no-print flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
        <div>
          <p className="text-xs font-semibold uppercase text-brand-600">Payment Receipt</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Thermal slip for fee record.</p>
        </div>
        <Button size="sm" variant="outline" onClick={handlePrint} className="px-3 py-2 text-xs">
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

      <div className="thermal-receipt mx-auto w-[302px] bg-white p-4 font-mono text-[11px] leading-tight text-black shadow-sm">
        <div className="text-center">
          <p className="text-sm font-bold">LGES sectt</p>
          <p className="font-bold">{effectiveChallan?.student.branchName || 'School Branch'}</p>
          <p>{effectiveChallan?.student.branchAddress || 'Branch address'}</p>
          <p>{effectiveChallan?.student.branchPhone || effectiveChallan?.student.branchEmail || ''}</p>
        </div>

        <div className="my-3 border-t border-dashed border-black" />
        <p className="text-center text-sm font-bold">FEE PAYMENT RECEIPT</p>
        <div className="my-3 border-t border-dashed border-black" />

        <ReceiptLine label="Receipt No" value={payment.receipt_number} />
        <ReceiptLine label="Date" value={formatDate(payment.payment_date)} />
        <ReceiptLine label="Challan" value={effectiveChallan?.challan_number || payment.challan_id} />
        <ReceiptLine label="Month" value={effectiveChallan?.fee_month || '-'} />
        <ReceiptLine label="Student" value={effectiveChallan?.student.name || '-'} />
        <ReceiptLine label="Class" value={effectiveChallan?.student.class || '-'} />
        <ReceiptLine label="Roll No" value={effectiveChallan?.student.rollNumber || '-'} />
        <ReceiptLine label="Received From" value={payment.received_from || effectiveChallan?.student.parentName || effectiveChallan?.student.name || '-'} />

        <div className="my-3 border-t border-dashed border-black" />
        <ReceiptLine label="Total Fee" value={`Rs. ${formatCurrency(effectiveChallan?.total_amount || 0)}`} />
        <ReceiptLine label="Paid Now" value={`Rs. ${formatCurrency(payment.amount)}`} strong />
        <ReceiptLine label="Total Paid" value={`Rs. ${formatCurrency(effectiveChallan?.deposit_amount || payment.amount)}`} />
        <ReceiptLine label="Balance Due" value={`Rs. ${formatCurrency(effectiveChallan?.due_amount || 0)}`} strong />
        <ReceiptLine label="Method" value={formatMethod(payment.payment_method)} />
        {payment.reference_number && <ReceiptLine label="Reference" value={payment.reference_number} />}

        <div className="my-3 border-t border-dashed border-black" />
        <ReceiptLine label="Received By" value={payment.received_by_name || 'School Office'} />
        {payment.notes && <p className="mt-2 whitespace-pre-wrap break-words">Note: {payment.notes}</p>}
        <p className="mt-4 text-center text-[10px]">This is a system generated receipt.</p>
      </div>

      <style jsx global>{`
        @media print {
          body.thermal-receipt-printing {
            margin: 0 !important;
            width: 80mm !important;
            min-height: 120mm !important;
            background: #ffffff !important;
          }
          body.thermal-receipt-printing {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body.thermal-receipt-printing * {
            visibility: hidden !important;
          }
          body.thermal-receipt-printing .thermal-receipt-root,
          body.thermal-receipt-printing .thermal-receipt-root *,
          body.thermal-receipt-printing .thermal-receipt,
          body.thermal-receipt-printing .thermal-receipt * {
            visibility: visible !important;
          }
          body.thermal-receipt-printing .thermal-receipt-root {
            position: fixed !important;
            inset: 0 auto auto 0 !important;
            width: 80mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
          body.thermal-receipt-printing .thermal-receipt {
            width: 80mm !important;
            margin: 0 !important;
            padding: 4mm !important;
            box-shadow: none !important;
          }
          body.thermal-receipt-printing .challan-print-root,
          body.thermal-receipt-printing .challan-print-root * {
            display: none !important;
            visibility: hidden !important;
          }
          body.thermal-receipt-printing .no-print {
            display: none !important;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

function ReceiptLine({ label, value, strong = false }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className={`flex gap-3 py-0.5 ${strong ? 'font-bold' : ''}`}>
      <span className="w-[92px] shrink-0">{label}</span>
      <span className="shrink-0">:</span>
      <span className="min-w-0 flex-1 break-words text-right">{value}</span>
    </div>
  );
}

export default ThermalFeeReceipt;
