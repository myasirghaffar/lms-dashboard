'use client';

import React, { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import DatePicker from "@/components/form/date-picker";
import Button from "@/components/ui/button/Button";
import StudentSearch from "@/components/fees/StudentSearch";
import StudentInfoCard from "@/components/fees/StudentInfoCard";
import FeesTable from "@/components/fees/FeesTable";
import FeesSummary from "@/components/fees/FeesSummary";
import FeeSlipPreview from "@/components/fees/FeeSlipPreview";
import { requestDashboardApi } from "@/lib/dashboardApi";
import { buildItemsForStudent, calculateFeeTotals, getDefaultFeeDates, MONTH_OPTIONS, toFeeStudent } from "@/lib/fees";
import {
  FeeChallanRecord,
  FeeFormValues,
  FeeParticularId,
  FeeStudent,
} from "@/types/fees";
import type { StudentManagementRecord } from "@/types/user-management";

type StudentsResponse = { students: StudentManagementRecord[] };
type ChallansResponse = { challans: FeeChallanRecord[] };

const buildInitialFormValues = (student: FeeStudent | null): FeeFormValues => {
  const dates = getDefaultFeeDates();

  return {
    month: MONTH_OPTIONS[new Date().getMonth()] || MONTH_OPTIONS[0],
    date: dates.issueDate,
    dueDate: dates.dueDate,
    validityDate: dates.validityDate,
    items: buildItemsForStudent(student),
    deposit: 0,
  };
};

export default function FeesModulePage() {
  const [feeStudents, setFeeStudents] = useState<FeeStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<FeeStudent | null>(
    null,
  );
  const [createdChallans, setCreatedChallans] = useState<FeeChallanRecord[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [createForFamily, setCreateForFamily] = useState(false);
  const [formValues, setFormValues] = useState<FeeFormValues>(() =>
    buildInitialFormValues(null),
  );

  useEffect(() => {
    let mounted = true;

    const loadStudents = async () => {
      setIsLoadingStudents(true);
      setErrorMessage("");
      try {
        const payload = await requestDashboardApi<StudentsResponse>('/api/students');
        if (!mounted) return;
        setFeeStudents(payload.students.map(toFeeStudent));
      } catch (error) {
        if (!mounted) return;
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load students.');
      } finally {
        if (mounted) setIsLoadingStudents(false);
      }
    };

    void loadStudents();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setFormValues(buildInitialFormValues(selectedStudent));
    setCreatedChallans([]);
  }, [selectedStudent]);

  const totals = useMemo(() => calculateFeeTotals(formValues.items, formValues.deposit), [formValues.items, formValues.deposit]);
  const familyStudents = useMemo(() => {
    if (!selectedStudent?.parentId) return selectedStudent ? [selectedStudent] : [];
    return feeStudents.filter((student) => student.parentId === selectedStudent.parentId);
  }, [feeStudents, selectedStudent]);

  const selectedStudentsForCreation = createForFamily ? familyStudents : selectedStudent ? [selectedStudent] : [];

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

  const handleDueDateChange = (_selectedDates: Date[], dateStr: string) => {
    if (!dateStr) return;
    setFormValues((prev) => ({ ...prev, dueDate: dateStr }));
  };

  const handleValidityDateChange = (_selectedDates: Date[], dateStr: string) => {
    if (!dateStr) return;
    setFormValues((prev) => ({ ...prev, validityDate: dateStr }));
  };

  const handleCreateChallan = async () => {
    if (!selectedStudentsForCreation.length) {
      setErrorMessage('Select a student first.');
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const payload = await requestDashboardApi<ChallansResponse>('/api/fee-challans', {
        method: 'POST',
        body: JSON.stringify({
          student_ids: selectedStudentsForCreation.map((student) => student.id),
          fee_month: formValues.month,
          issue_date: formValues.date,
          due_date: formValues.dueDate,
          validity_date: formValues.validityDate,
          items: formValues.items,
          deposit_amount: formValues.deposit,
        }),
      });
      setCreatedChallans(payload.challans);
      setStatusMessage(`${payload.challans.length} challan${payload.challans.length === 1 ? '' : 's'} created.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create challan.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "BRANCH_ADMIN"]}>
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
              {isLoadingStudents && (
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading linked students...</p>
              )}
              <StudentInfoCard student={selectedStudent} />
              {selectedStudent?.parentId && familyStudents.length > 1 && (
                <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={createForFamily}
                    onChange={(event) => setCreateForFamily(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  Create challans for all {familyStudents.length} children linked to {selectedStudent.parentName || 'this parent'}
                </label>
              )}
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
                    label="Issue Date"
                    defaultDate={formValues.date}
                    onChange={handleDateChange}
                  />
                </div>
                <div className="space-y-2">
                  <DatePicker
                    id="fee-due-date"
                    label="Due Date"
                    defaultDate={formValues.dueDate}
                    onChange={handleDueDateChange}
                  />
                </div>
                <div className="space-y-2">
                  <DatePicker
                    id="fee-validity-date"
                    label="Validity Date"
                    defaultDate={formValues.validityDate}
                    onChange={handleValidityDateChange}
                  />
                </div>
              </div>

              <FeesTable
                items={formValues.items}
                onChangeAmount={handleItemAmountChange}
              />

              <FeesSummary
                total={totals.total}
                deposit={formValues.deposit}
                onDepositChange={handleDepositChange}
                onReset={handleReset}
              />
              {errorMessage && (
                <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
                  {errorMessage}
                </p>
              )}
              {statusMessage && (
                <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                  {statusMessage}
                </p>
              )}
              <Button
                size="sm"
                onClick={handleCreateChallan}
                disabled={!selectedStudent || isSaving}
              >
                {isSaving ? 'Creating...' : createForFamily ? 'Create Family Challans' : 'Create Challan'}
              </Button>
            </ComponentCard>
          </div>

          <div className="xl:col-span-1">
            <FeeSlipPreview
              challan={createdChallans[0]}
              student={createdChallans[0]?.student || selectedStudent}
              month={createdChallans[0]?.fee_month || formValues.month}
              date={createdChallans[0]?.issue_date || formValues.date}
              dueDate={createdChallans[0]?.due_date || formValues.dueDate}
              validityDate={createdChallans[0]?.validity_date || formValues.validityDate}
              items={createdChallans[0]?.items || formValues.items}
              total={createdChallans[0]?.total_amount ?? totals.total}
              deposit={formValues.deposit}
              due={createdChallans[0]?.due_amount ?? totals.due}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
