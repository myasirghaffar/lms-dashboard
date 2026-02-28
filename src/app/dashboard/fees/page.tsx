'use client';

import React, { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import DatePicker from "@/components/form/date-picker";
import StudentSearch from "@/components/fees/StudentSearch";
import StudentInfoCard from "@/components/fees/StudentInfoCard";
import FeesTable from "@/components/fees/FeesTable";
import FeesSummary from "@/components/fees/FeesSummary";
import FeeSlipPreview from "@/components/fees/FeeSlipPreview";
import studentsData from "@/data/students.json";
import {
  FeeFormValues,
  FeeLineItem,
  FeeParticularId,
  FeeStudent,
} from "@/types/fees";

const feeStudents = studentsData as unknown as FeeStudent[];

const MONTH_OPTIONS: string[] = [
  "January 2025",
  "February 2025",
  "March 2025",
  "April 2025",
  "May 2025",
  "June 2025",
  "July 2025",
  "August 2025",
  "September 2025",
  "October 2025",
  "November 2025",
  "December 2025",
];

const buildInitialItems = (student: FeeStudent | null): FeeLineItem[] => [
  {
    id: "MONTHLY_FEE",
    label: "Monthly Fee",
    amount: student?.monthlyFee ?? 0,
  },
  {
    id: "ADMISSION_FEE",
    label: "Admission Fee",
    amount: 0,
  },
  {
    id: "EXTRA_COACHING_FEE",
    label: "Extra Coaching Fee",
    amount: 0,
  },
  {
    id: "REGISTRATION_FEE",
    label: "Registration Fee",
    amount: 0,
  },
  {
    id: "PAPER_FUND",
    label: "Paper Fund",
    amount: 0,
  },
  {
    id: "BOOKS",
    label: "Books",
    amount: 0,
  },
  {
    id: "UNIFORM",
    label: "Uniform",
    amount: 0,
  },
  {
    id: "FINE",
    label: "Fine",
    amount: 0,
  },
  {
    id: "OTHERS",
    label: "Others",
    amount: 0,
  },
  {
    id: "PREVIOUS_BALANCE",
    label: "Previous Balance",
    amount: student?.previousBalance ?? 0,
  },
  {
    id: "DISCOUNT",
    label: "Discount",
    amount: 0,
  },
];

const buildInitialFormValues = (student: FeeStudent | null): FeeFormValues => {
  const today = new Date();
  const isoDate = today.toISOString().slice(0, 10);

  return {
    month: MONTH_OPTIONS[0],
    date: isoDate,
    items: buildInitialItems(student),
    deposit: 0,
  };
};

export default function FeesModulePage() {
  const [selectedStudent, setSelectedStudent] = useState<FeeStudent | null>(
    null,
  );
  const [formValues, setFormValues] = useState<FeeFormValues>(() =>
    buildInitialFormValues(null),
  );

  useEffect(() => {
    setFormValues(buildInitialFormValues(selectedStudent));
  }, [selectedStudent]);

  const total = useMemo(
    () =>
      formValues.items.reduce((sum, item) => {
        if (item.id === "DISCOUNT") {
          return sum - Math.max(0, item.amount);
        }
        return sum + Math.max(0, item.amount);
      }, 0),
    [formValues.items],
  );

  const due = useMemo(
    () => Math.max(0, total - Math.max(0, formValues.deposit)),
    [total, formValues.deposit],
  );

  const handleItemAmountChange = (id: FeeParticularId, amount: number) => {
    setFormValues((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, amount: Math.max(0, amount) } : item,
      ),
    }));
  };

  const handleDepositChange = (value: number) => {
    setFormValues((prev) => ({
      ...prev,
      deposit: Math.max(0, value),
    }));
  };

  const handleMonthChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      month: value,
    }));
  };

  const handleDateChange = (_selectedDates: Date[], dateStr: string) => {
    if (!dateStr) return;
    setFormValues((prev) => ({
      ...prev,
      date: dateStr,
    }));
  };

  const handleReset = () => {
    setFormValues(buildInitialFormValues(selectedStudent));
  };

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "BRANCH_ADMIN", "PARENT"]}>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Fees Collection" />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <ComponentCard
              title="Student Search"
              desc="Quickly search students by name or registration ID and load their fee profile."
            >
              <StudentSearch
                students={feeStudents}
                onSelectStudent={setSelectedStudent}
                selectedStudentId={selectedStudent?.id}
              />
              <StudentInfoCard student={selectedStudent} />
            </ComponentCard>

            <ComponentCard
              title="Fees Collection"
              desc="Capture fee details for the selected student, including discounts, fines and previous balance."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-200">
                    Registration ID
                  </label>
                  <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                    {selectedStudent?.id ?? "Select a student"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-200">
                    Student Name
                  </label>
                  <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                    {selectedStudent?.name ?? "—"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-200">
                    Father / Guardian
                  </label>
                  <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                    {selectedStudent?.fatherName ?? "—"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-200">
                    Class
                  </label>
                  <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                    {selectedStudent?.class ?? "—"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-200">
                    Fee Month
                  </label>
                  <select
                    value={formValues.month}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-purple-500 dark:focus:ring-purple-500/30"
                  >
                    {MONTH_OPTIONS.map((monthOption) => (
                      <option key={monthOption} value={monthOption}>
                        {monthOption}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <DatePicker
                    id="fee-date"
                    label="Fee Date"
                    defaultDate={formValues.date}
                    onChange={handleDateChange}
                  />
                </div>
              </div>

              <FeesTable
                items={formValues.items}
                onChangeAmount={handleItemAmountChange}
              />

              <FeesSummary
                total={total}
                deposit={formValues.deposit}
                onDepositChange={handleDepositChange}
                onReset={handleReset}
              />
            </ComponentCard>
          </div>

          <div className="xl:col-span-1">
            <FeeSlipPreview
              student={selectedStudent}
              month={formValues.month}
              date={formValues.date}
              items={formValues.items}
              total={total}
              deposit={formValues.deposit}
              due={due}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

