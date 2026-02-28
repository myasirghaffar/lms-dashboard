'use client';

import React from "react";
import { FeeStudent } from "@/types/fees";

interface StudentInfoCardProps {
  student: FeeStudent | null;
}

const StudentInfoCard: React.FC<StudentInfoCardProps> = ({ student }) => {
  if (!student) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-purple-50/40 px-4 py-5 text-sm text-gray-500 shadow-sm dark:border-gray-700 dark:bg-purple-950/20 dark:text-gray-300">
        Select a student to view fee details and start a new fee collection.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            Fee Profile
          </p>
          <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            {student.name}
          </h3>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Reg ID:{" "}
            <span className="font-mono text-gray-800 dark:text-gray-100">
              {student.id}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm sm:text-right">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Father / Guardian
            </p>
            <p className="mt-1 font-medium text-gray-800 dark:text-gray-100">
              {student.fatherName}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Class
            </p>
            <p className="mt-1 font-medium text-gray-800 dark:text-gray-100">
              {student.class}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Previous Balance
            </p>
            <p className="mt-1 font-semibold text-amber-600 dark:text-amber-400">
              Rs. {student.previousBalance.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Monthly Fee
            </p>
            <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
              Rs. {student.monthlyFee.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoCard;

