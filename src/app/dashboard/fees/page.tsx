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
import FeePaymentHistory from "@/components/fees/FeePaymentHistory";
import FeeSlipPreview from "@/components/fees/FeeSlipPreview";
import ThermalFeeReceipt from "@/components/fees/ThermalFeeReceipt";
import { Modal } from "@/components/ui/modal";
import { requestDashboardApi } from "@/lib/dashboardApi";
import { buildItemsForStudent, calculateFeeTotals, getDefaultFeeDates, MONTH_OPTIONS, toFeeStudent } from "@/lib/fees";
import { Printer, Search } from "lucide-react";
import {
  FeeChallanRecord,
  FeeFormValues,
  FeePaymentMethod,
  FeePaymentRecord,
  FeeParticularId,
  FeeStudent,
} from "@/types/fees";
import type { StudentManagementRecord } from "@/types/user-management";

type StudentsResponse = { students: StudentManagementRecord[] };
type ChallansResponse = { challans: FeeChallanRecord[] };
type PaymentResponse = { payment: FeePaymentRecord; challan: FeeChallanRecord };

const PAYMENT_METHOD_OPTIONS: { value: FeePaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Card' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'online', label: 'Online' },
  { value: 'other', label: 'Other' },
];

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
  const [allChallans, setAllChallans] = useState<FeeChallanRecord[]>([]);
  const [selectedPaymentChallan, setSelectedPaymentChallan] = useState<FeeChallanRecord | null>(null);
  const [receiptPayment, setReceiptPayment] = useState<FeePaymentRecord | null>(null);
  const [receiptChallan, setReceiptChallan] = useState<FeeChallanRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<FeePaymentMethod>('cash');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [receivedFrom, setReceivedFrom] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [feeRecordSearch, setFeeRecordSearch] = useState('');
  const [feeRecordStatus, setFeeRecordStatus] = useState('all');
  const [feeRecordMonth, setFeeRecordMonth] = useState('all');
  const [feeRecordClass, setFeeRecordClass] = useState('all');
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isLoadingChallans, setIsLoadingChallans] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [createForFamily, setCreateForFamily] = useState(false);
  const [formValues, setFormValues] = useState<FeeFormValues>(() =>
    buildInitialFormValues(null),
  );

  const loadChallans = React.useCallback(async () => {
    setIsLoadingChallans(true);
    try {
      const payload = await requestDashboardApi<ChallansResponse>('/api/fee-challans');
      setAllChallans(payload.challans);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load challan records.');
    } finally {
      setIsLoadingChallans(false);
    }
  }, []);

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
    void loadChallans();
    return () => {
      mounted = false;
    };
  }, [loadChallans]);

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

  const feeRecordMonths = useMemo(() => {
    return [...new Set(allChallans.map((challan) => challan.fee_month).filter(Boolean))];
  }, [allChallans]);

  const feeRecordClasses = useMemo(() => {
    return [...new Set(allChallans.map((challan) => challan.student.class).filter(Boolean))].sort();
  }, [allChallans]);

  const filteredChallans = useMemo(() => {
    const needle = feeRecordSearch.trim().toLowerCase();
    return allChallans.filter((challan) => {
      const matchesStatus = feeRecordStatus === 'all' || challan.status === feeRecordStatus;
      const matchesMonth = feeRecordMonth === 'all' || challan.fee_month === feeRecordMonth;
      const matchesClass = feeRecordClass === 'all' || challan.student.class === feeRecordClass;
      const haystack = [
        challan.student.name,
        challan.student.rollNumber,
        challan.student.class,
        challan.student.id,
        challan.student.parentName,
        challan.challan_number,
        challan.fee_month,
        challan.status,
        ...(challan.payments || []).flatMap((payment) => [
          payment.receipt_number,
          payment.received_from,
          payment.reference_number,
        ]),
      ].filter(Boolean).join(' ').toLowerCase();

      return matchesStatus && matchesMonth && matchesClass && (!needle || haystack.includes(needle));
    });
  }, [allChallans, feeRecordClass, feeRecordMonth, feeRecordSearch, feeRecordStatus]);

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
      setAllChallans((current) => [...payload.challans, ...current]);
      setStatusMessage(`${payload.challans.length} challan${payload.challans.length === 1 ? '' : 's'} created.`);
      void loadChallans();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create challan.');
    } finally {
      setIsSaving(false);
    }
  };

  const openPaymentModal = (challan: FeeChallanRecord) => {
    setSelectedPaymentChallan(challan);
    setPaymentAmount(challan.due_amount);
    setPaymentMethod('cash');
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setReceivedFrom(challan.student.parentName || challan.student.name);
    setPaymentReference('');
    setPaymentNotes('');
    setReceiptPayment(null);
    setReceiptChallan(null);
    setErrorMessage('');
    setStatusMessage('');
  };

  const openReceiptModal = (challan: FeeChallanRecord) => {
    const latestPayment = challan.payments?.[0] || null;
    setSelectedPaymentChallan(challan);
    setReceiptPayment(latestPayment);
    setReceiptChallan(challan);
    setPaymentAmount(0);
    setPaymentMethod('cash');
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setReceivedFrom(challan.student.parentName || challan.student.name);
    setPaymentReference('');
    setPaymentNotes('');
    setErrorMessage('');
    setStatusMessage('');
  };

  const clearFeeRecordFilters = () => {
    setFeeRecordSearch('');
    setFeeRecordStatus('all');
    setFeeRecordMonth('all');
    setFeeRecordClass('all');
  };

  const handleRecordPayment = async () => {
    if (!selectedPaymentChallan) return;
    setIsRecordingPayment(true);
    setErrorMessage('');
    setStatusMessage('');
    try {
      const payload = await requestDashboardApi<PaymentResponse>('/api/fee-payments', {
        method: 'POST',
        body: JSON.stringify({
          challan_id: selectedPaymentChallan.id,
          amount: paymentAmount,
          payment_method: paymentMethod,
          payment_date: paymentDate,
          received_from: receivedFrom,
          reference_number: paymentReference,
          notes: paymentNotes,
        }),
      });
      const updatedChallan = {
        ...selectedPaymentChallan,
        ...payload.challan,
        student: selectedPaymentChallan.student,
        items: selectedPaymentChallan.items,
        payments: [payload.payment, ...(selectedPaymentChallan.payments || [])],
      };
      setReceiptPayment(payload.payment);
      setReceiptChallan(updatedChallan);
      setSelectedPaymentChallan(updatedChallan);
      setAllChallans((current) => current.map((challan) => challan.id === updatedChallan.id ? updatedChallan : challan));
      setStatusMessage(`Payment recorded. Receipt ${payload.payment.receipt_number} created.`);
      void loadChallans();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to record payment.');
    } finally {
      setIsRecordingPayment(false);
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

        <ComponentCard
          title="Fee Records"
          desc="Track issued challans, received payments, outstanding balances, and receipt history."
        >
          {isLoadingChallans ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading fee records...</p>
          ) : !allChallans.length ? (
            <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              No fee challans have been created yet.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_180px_180px_180px_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={feeRecordSearch}
                    onChange={(event) => setFeeRecordSearch(event.target.value)}
                    placeholder="Search student, roll no, challan, parent, receipt..."
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <select
                  value={feeRecordStatus}
                  onChange={(event) => setFeeRecordStatus(event.target.value)}
                  className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="all">All statuses</option>
                  <option value="issued">Issued</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={feeRecordMonth}
                  onChange={(event) => setFeeRecordMonth(event.target.value)}
                  className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="all">All months</option>
                  {feeRecordMonths.map((month) => <option key={month} value={month}>{month}</option>)}
                </select>
                <select
                  value={feeRecordClass}
                  onChange={(event) => setFeeRecordClass(event.target.value)}
                  className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="all">All classes</option>
                  {feeRecordClasses.map((className) => <option key={className} value={className}>{className}</option>)}
                </select>
                <button
                  type="button"
                  onClick={clearFeeRecordFilters}
                  className="h-11 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Clear
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span>
                  Showing {filteredChallans.length} of {allChallans.length} fee record{allChallans.length === 1 ? '' : 's'}
                </span>
                <span>Use receipt number search to reprint an old thermal slip.</span>
              </div>

              {filteredChallans.length === 0 ? (
                <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  No fee records match the selected filters.
                </p>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Student</th>
                    <th className="px-4 py-3 text-left font-semibold">Challan</th>
                    <th className="px-4 py-3 text-left font-semibold">Month</th>
                    <th className="px-4 py-3 text-right font-semibold">Total</th>
                    <th className="px-4 py-3 text-right font-semibold">Paid</th>
                    <th className="px-4 py-3 text-right font-semibold">Due</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredChallans.map((challan) => (
                    <tr key={challan.id}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900 dark:text-white">{challan.student.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{challan.student.class} · {challan.student.rollNumber || challan.student.id}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-300">{challan.challan_number}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{challan.fee_month}</td>
                      <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-200">Rs. {challan.total_amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-200">Rs. {challan.deposit_amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Rs. {challan.due_amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          challan.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : challan.status === 'partial'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {challan.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {challan.status === 'paid' || challan.due_amount <= 0 ? (
                          challan.payments?.length ? (
                            <button
                              type="button"
                              onClick={() => openReceiptModal(challan)}
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              Print Slip
                            </button>
                          ) : (
                            <span className="inline-flex rounded-lg bg-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">Paid</span>
                          )
                        ) : (
                          <button
                            type="button"
                            onClick={() => openPaymentModal(challan)}
                            disabled={challan.status === 'cancelled'}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
                          >
                            Record Payment
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
              )}
            </div>
          )}
        </ComponentCard>

        <Modal isOpen={Boolean(selectedPaymentChallan)} onClose={() => setSelectedPaymentChallan(null)} className="max-w-5xl">
          <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Record Fee Payment</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedPaymentChallan?.student.name} · {selectedPaymentChallan?.fee_month} · {selectedPaymentChallan?.challan_number}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <SummaryBox label="Total Fee" value={`Rs. ${(selectedPaymentChallan?.total_amount || 0).toLocaleString()}`} />
                <SummaryBox label="Paid" value={`Rs. ${(selectedPaymentChallan?.deposit_amount || 0).toLocaleString()}`} />
                <SummaryBox label="Due" value={`Rs. ${(selectedPaymentChallan?.due_amount || 0).toLocaleString()}`} strong />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Amount Received</label>
                  <input
                    type="number"
                    min={1}
                    max={selectedPaymentChallan?.due_amount || undefined}
                    value={paymentAmount}
                    onChange={(event) => setPaymentAmount(Math.max(0, Number(event.target.value || 0)))}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(event) => setPaymentDate(event.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value as FeePaymentMethod)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    {PAYMENT_METHOD_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Received From</label>
                  <input
                    value={receivedFrom}
                    onChange={(event) => setReceivedFrom(event.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Reference No.</label>
                  <input
                    value={paymentReference}
                    onChange={(event) => setPaymentReference(event.target.value)}
                    placeholder="Optional bank/reference number"
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                  <input
                    value={paymentNotes}
                    onChange={(event) => setPaymentNotes(event.target.value)}
                    placeholder="Optional"
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                <button type="button" onClick={() => setSelectedPaymentChallan(null)} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleRecordPayment}
                  disabled={isRecordingPayment || !selectedPaymentChallan || selectedPaymentChallan.due_amount <= 0}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {isRecordingPayment ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <FeePaymentHistory
                payments={selectedPaymentChallan?.payments}
                selectedPaymentId={(receiptPayment || selectedPaymentChallan?.payments?.[0])?.id || null}
                onSelectPayment={(payment) => {
                  setReceiptPayment(payment);
                  setReceiptChallan(selectedPaymentChallan);
                }}
              />
              <ThermalFeeReceipt payment={receiptPayment || selectedPaymentChallan?.payments?.[0] || null} challan={receiptChallan || selectedPaymentChallan} />
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

function SummaryBox({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-lg font-bold ${strong ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>{value}</p>
    </div>
  );
}
