'use client';

import React, { useMemo } from "react";
import { Printer, FileDown, Barcode } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { FeeLineItem, FeeStudent } from "@/types/fees";

interface FeeSlipPreviewProps {
  student: FeeStudent | null;
  month: string;
  date: string;
  items: FeeLineItem[];
  total: number;
  deposit: number;
  due: number;
}

const FeeSlipPreview: React.FC<FeeSlipPreviewProps> = ({
  student,
  month,
  date,
  items,
  total,
  deposit,
  due,
}) => {
  const lateFeeTotal = useMemo(() => {
    const safeTotal = Math.max(0, total);
    if (safeTotal === 0) return 0;
    const extra = Math.round(safeTotal * 0.05);
    return safeTotal + extra;
  }, [total]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const visibleItems = useMemo(
    () => items.filter((item) => item.amount > 0),
    [items],
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            Fee Slip Preview
          </p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Printable voucher-style slip for accounts and parents.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="text-xs font-medium"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {}}
            className="text-xs font-medium"
          >
            <FileDown className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 bg-slate-50 px-5 py-4 dark:bg-slate-900/40">
        <div className="rounded-xl border border-dashed border-purple-200 bg-white px-4 py-3 text-xs shadow-sm dark:border-purple-900 dark:bg-gray-950/60">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Al-Madina School System
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Multi-Branch Learning Campus · Lahore
              </p>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              <p>
                Fee Month:{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {month || "-"}
                </span>
              </p>
              <p className="mt-0.5">
                Date:{" "}
                <span className="font-mono text-gray-800 dark:text-gray-100">
                  {date || "-"}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] text-gray-600 dark:text-gray-300">
            <div className="space-y-0.5">
              <p>
                Student Name:{" "}
                <span className="font-semibold">
                  {student?.name ?? "—"}
                </span>
              </p>
              <p>
                Father Name:{" "}
                <span className="font-semibold">
                  {student?.fatherName ?? "—"}
                </span>
              </p>
              <p>
                Class:{" "}
                <span className="font-semibold">
                  {student?.class ?? "—"}
                </span>
              </p>
            </div>
            <div className="space-y-0.5">
              <p>
                Student ID:{" "}
                <span className="font-mono font-semibold">
                  {student?.id ?? "—"}
                </span>
              </p>
              <p>
                Previous Balance:{" "}
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  Rs.{" "}
                  {student
                    ? student.previousBalance.toLocaleString()
                    : "0"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white text-xs shadow-sm dark:border-gray-800 dark:bg-gray-950/60">
          <table className="min-w-full">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-slate-900/70 dark:text-gray-300">
              <tr>
                <th className="px-3 py-2 text-left">Sr</th>
                <th className="px-3 py-2 text-left">Fee Particulars</th>
                <th className="px-3 py-2 text-right">Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {visibleItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-6 text-center text-[11px] text-gray-500 dark:text-gray-400"
                  >
                    No fee items added yet. Fill in the fee table to preview the
                    slip.
                  </td>
                </tr>
              ) : (
                visibleItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-3 py-1.5 text-[11px] text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-3 py-1.5 text-[11px] text-gray-700 dark:text-gray-200">
                      {item.label}
                    </td>
                    <td className="px-3 py-1.5 text-right text-[11px] text-gray-800 dark:text-gray-100">
                      Rs. {item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-slate-50 text-[11px] text-gray-700 dark:bg-slate-900/70 dark:text-gray-200">
              <tr>
                <td className="px-3 py-2 font-semibold" colSpan={2}>
                  Total
                </td>
                <td className="px-3 py-2 text-right font-semibold">
                  Rs. {Math.max(0, total).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2" colSpan={2}>
                  Deposit
                </td>
                <td className="px-3 py-2 text-right">
                  Rs. {Math.max(0, deposit).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2" colSpan={2}>
                  Due Balance
                </td>
                <td className="px-3 py-2 text-right">
                  Rs. {Math.max(0, due).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2" colSpan={2}>
                  Payable After Due Date
                </td>
                <td className="px-3 py-2 text-right">
                  Rs. {lateFeeTotal.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-[11px] text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-950/70 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-24 items-center justify-center rounded border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-900">
              <Barcode className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-200">
                Barcode / QR Placeholder
              </p>
              <p className="text-[11px]">
                Will be generated from voucher number when backend is connected.
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-700 dark:text-gray-200">
              For Office Use Only
            </p>
            <p className="text-[11px]">
              Signature &amp; stamp will be applied on printed copy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeSlipPreview;

