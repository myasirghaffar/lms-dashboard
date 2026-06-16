'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { FileDown, Printer } from 'lucide-react';
import Button from '@/components/ui/button/Button';
import { calculateFeeTotals } from '@/lib/fees';
import type { FeeChallanRecord, FeeLineItem, FeeStudent } from '@/types/fees';

interface FeeSlipPreviewProps {
  challan?: FeeChallanRecord;
  student: FeeStudent | null;
  month: string;
  date: string;
  dueDate?: string;
  validityDate?: string;
  items: FeeLineItem[];
  total: number;
  deposit: number;
  due: number;
}

const copyLabels = ['BANK COPY', 'SCHOOL COPY', 'PARENT COPY'];

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

function buildChallanFileName(student: FeeStudent | null) {
  const name = student?.name?.trim() || 'Student';
  const className = student?.class?.trim() || 'Class';
  return `${name} ${className} Fee Challan`.replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim();
}

function barcodeText(value: string) {
  const seed = value.replace(/[^0-9A-Za-z]/g, '') || '0000000000';
  return seed
    .slice(0, 32)
    .split('')
    .map((char, index) => {
      const width = (char.charCodeAt(0) + index) % 3;
      return width === 0 ? 'w-[1px]' : width === 1 ? 'w-[2px]' : 'w-[3px]';
    });
}

const FeeSlipPreview: React.FC<FeeSlipPreviewProps> = ({
  challan,
  student,
  month,
  date,
  dueDate,
  validityDate,
  items,
  total,
  deposit,
  due,
}) => {
  const totals = useMemo(() => calculateFeeTotals(items, deposit), [items, deposit]);
  const effectiveTotal = challan?.total_amount ?? total;
  const effectiveDue = challan?.due_amount ?? due;
  const lateFee = challan?.late_fee_amount ?? totals.lateFee;
  const payableAfterDueDate = challan?.payable_after_due_date ?? effectiveDue + lateFee;
  const challanNumber = challan?.challan_number || 'Draft Challan';
  const visibleItems = items.filter((item) => item.amount > 0 && item.id !== 'DISCOUNT');
  const discount = challan?.discount_amount ?? totals.discount;
  const bars = barcodeText(challanNumber);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      const previousTitle = document.title;
      document.title = buildChallanFileName(student);

      const restoreTitle = () => {
        document.title = previousTitle;
        window.removeEventListener('afterprint', restoreTitle);
      };

      window.addEventListener('afterprint', restoreTitle);
      window.print();
      window.setTimeout(restoreTitle, 1500);
    }
  };

  return (
    <div className="challan-print-root space-y-4">
      <div className="no-print flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
        <div>
          <p className="text-xs font-semibold uppercase text-brand-600">Fee Challan</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Print dialog can save this as PDF.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handlePrint} className="px-3 py-2 text-xs">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button size="sm" variant="outline" onClick={handlePrint} className="px-3 py-2 text-xs">
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <div className="challan-sheet overflow-x-auto bg-white p-3 text-black shadow-sm dark:bg-white">
        <div className="challan-grid grid min-w-[980px] grid-cols-3 gap-3">
          {copyLabels.map((copyLabel) => (
            <div key={copyLabel} className="challan-copy border border-black bg-white p-2 text-[10px] leading-tight">
              <div className="flex items-start gap-2">
                <Image src="/images/logo/logo-icon.svg" alt="LMS logo" width={36} height={36} className="shrink-0 object-contain" />
                <div className="flex-1 text-center">
                  <p className="text-[10px] font-bold">LGES sectt</p>
                  <p className="text-[9px] font-bold">{student?.branchName || 'AMS Talwandi High School'}</p>
                  <p className="mt-1 font-bold">For Payable At Any Branch of</p>
                  <p className="font-bold">Askari Bank (AKBL)</p>
                  <p>{student?.branchAddress || 'Branch address will appear here'}</p>
                  <p>{student?.branchPhone || student?.branchEmail || ''}</p>
                </div>
              </div>

              <p className="mt-2 text-center font-bold">Bill Digit Challan Number</p>
              <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1">
                <Info label="Challan No" value={challanNumber} mono />
                <Info label="Billing Month" value={month || '-'} />
                <Info label="Student ID" value={student?.rollNumber || student?.id || '-'} mono />
                <Info label="Cat Gp" value="Civ" />
                <Info label="Std Name" value={student?.name || '-'} />
                <Info label="Issue Date" value={formatDate(date)} />
                <Info label="F Name" value={student?.fatherName || '-'} />
                <Info label="Due Date" value={formatDate(dueDate)} />
                <Info label="Class" value={student?.class || '-'} />
                <Info label="Validity Date" value={formatDate(validityDate)} />
                <Info label="Section" value="-" />
                <Info label="Parent" value={student?.parentName || '-'} />
              </div>

              <table className="mt-2 w-full border-collapse border border-black">
                <thead>
                  <tr>
                    <th className="border border-black px-1 py-1 text-left">Sr No.</th>
                    <th className="border border-black px-1 py-1 text-left">Particulars</th>
                    <th className="border border-black px-1 py-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.length ? (
                    visibleItems.map((item, index) => (
                      <tr key={`${copyLabel}-${item.id}`}>
                        <td className="border border-black px-1 py-1">{index + 1}</td>
                        <td className="border border-black px-1 py-1">{item.label}</td>
                        <td className="border border-black px-1 py-1 text-right">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="border border-black px-1 py-1">1</td>
                      <td className="border border-black px-1 py-1">School Fee</td>
                      <td className="border border-black px-1 py-1 text-right">0</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <table className="mt-1 w-full border-collapse border border-black">
                <tbody>
                  <FeeRow label="Arrears" value={student?.previousBalance || 0} />
                  <FeeRow label="Payable within due date" value={effectiveDue} />
                  {discount > 0 && <FeeRow label="Discount" value={discount} />}
                  <tr>
                    <td className="border border-black px-1 py-1 text-center">Late fee fine</td>
                    <td className="border border-black px-1 py-1 text-center">Till End of Month</td>
                    <td className="border border-black px-1 py-1 text-right">{formatCurrency(lateFee)}</td>
                  </tr>
                  <FeeRow label="Payable with Fine" value={payableAfterDueDate} />
                </tbody>
              </table>

              <div className="mt-2">
                <p className="font-bold">PAYMENT TERMS</p>
                <ol className="challan-terms mt-1 list-decimal space-y-0.5 pl-3 text-[8px]">
                  <li>If challan is paid after due date, late fine will be applicable.</li>
                  <li>Parents are advised to keep a record of the paid fee slip.</li>
                  <li>Payment can be deposited in the nominated bank branch.</li>
                  <li>This challan is system generated for the linked LMS student record.</li>
                  <li>For fee queries, contact the relevant branch office.</li>
                </ol>
              </div>

              <div className="challan-signature mt-3 grid grid-cols-[1fr_70px] border border-black">
                <div className="flex h-12 items-center justify-center border-r border-black font-bold">{copyLabel}:</div>
                <div className="flex flex-col items-center justify-end pb-1 text-[8px]">
                  <div className="mb-1 h-5 w-10 border-b border-black" />
                  Stamp & Signature
                </div>
              </div>

              <div className="challan-barcode mt-2 flex h-8 items-end justify-center gap-[2px]">
                {bars.map((widthClass, index) => (
                  <span key={index} className={`${widthClass} h-7 bg-black`} />
                ))}
              </div>
              <p className="mt-0.5 text-center text-[8px]">{challanNumber}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          html,
          body {
            margin: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            overflow: hidden !important;
            background: #ffffff !important;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body * {
            visibility: hidden !important;
          }
          .challan-print-root,
          .challan-print-root * ,
          .challan-sheet,
          .challan-sheet * {
            visibility: visible !important;
          }
          .challan-print-root {
            position: fixed !important;
            inset: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #ffffff !important;
            break-after: avoid-page !important;
            break-before: avoid-page !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
          }
          .challan-sheet {
            position: absolute !important;
            inset: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            padding: 5mm !important;
            overflow: hidden !important;
            box-shadow: none !important;
            break-after: avoid-page !important;
            break-before: avoid-page !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
          }
          .challan-grid {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 3mm !important;
            min-width: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
          }
          .challan-copy {
            height: 100% !important;
            min-height: 0 !important;
            overflow: hidden !important;
            padding: 2mm !important;
            font-size: 8px !important;
            line-height: 1.08 !important;
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
          }
          .challan-copy table {
            margin-top: 1.5mm !important;
            break-inside: avoid-page !important;
            page-break-inside: avoid !important;
          }
          .challan-copy th,
          .challan-copy td {
            padding: 0.8mm 1mm !important;
          }
          .challan-terms {
            font-size: 6.2px !important;
            line-height: 1.05 !important;
          }
          .challan-signature {
            margin-top: 2mm !important;
          }
          .challan-signature > div {
            height: 9mm !important;
          }
          .challan-barcode {
            height: 6mm !important;
            margin-top: 1.5mm !important;
          }
          .challan-barcode span {
            height: 6mm !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex min-w-0 gap-1">
      <span className="shrink-0 font-bold underline">{label}:</span>
      <span className={`truncate ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

function FeeRow({ label, value }: { label: string; value: number }) {
  return (
    <tr>
      <td className="border border-black px-1 py-1 font-bold" colSpan={2}>
        {label}
      </td>
      <td className="border border-black px-1 py-1 text-right">{formatCurrency(value)}</td>
    </tr>
  );
}

export default FeeSlipPreview;
