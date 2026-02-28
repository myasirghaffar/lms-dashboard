'use client';

import React from "react";
import { FeeLineItem, FeeParticularId } from "@/types/fees";

interface FeesTableProps {
  items: FeeLineItem[];
  onChangeAmount: (id: FeeParticularId, amount: number) => void;
}

const FeesTable: React.FC<FeesTableProps> = ({ items, onChangeAmount }) => {
  const handleAmountChange = (id: FeeParticularId, value: string) => {
    const numeric = Number(value.replace(/[^0-9.-]/g, ""));
    if (Number.isNaN(numeric)) {
      onChangeAmount(id, 0);
      return;
    }
    const safeValue = Math.max(0, Math.floor(numeric));
    onChangeAmount(id, safeValue);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
      <div className="max-h-[360px] overflow-y-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-purple-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-purple-950/40 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">Sr</th>
              <th className="px-4 py-3 text-left">Particulars</th>
              <th className="px-4 py-3 text-right">Amount (Rs.)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50/60 dark:hover:bg-gray-800/60"
              >
                <td className="px-4 py-2.5 text-xs font-medium text-gray-500">
                  {index + 1}
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100">
                  {item.label}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={Number.isNaN(item.amount) ? "" : item.amount}
                    onChange={(e) =>
                      handleAmountChange(item.id, e.target.value)
                    }
                    className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-right text-sm text-gray-900 shadow-xs focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-purple-500 dark:focus:ring-purple-500/30"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
        Tip: Enter <span className="font-semibold">0</span> for any line item
        that does not apply. Negative values are not allowed.
      </p>
    </div>
  );
};

export default FeesTable;

