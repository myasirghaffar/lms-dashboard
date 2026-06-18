'use client';

import React from 'react';
import Image from 'next/image';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { requestDashboardApi } from '@/lib/dashboardApi';
import { getProfileImageSrc } from '@/lib/profileImage';
import { ATTENDANCE_STATUSES } from '@/lib/attendance';
import { Building2, CalendarCheck, GraduationCap, Mail, Phone, ReceiptText, UserRound } from 'lucide-react';

interface ParentChildDetails {
  id: string;
  legacy_id: string | null;
  user_profile_id: string;
  parent_profile_id: string | null;
  branch_id: string | null;
  branch_name: string | null;
  branch_address: string | null;
  branch_phone_number: string | null;
  branch_email: string | null;
  class_id: string | null;
  class_name: string | null;
  class_teacher_name: string | null;
  roll_number: string;
  father_name: string | null;
  previous_balance: number;
  monthly_fee: number;
  name: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  profile_image: string | null;
  attendance_total: number;
  attendance_percentage: number | null;
  latest_attendance_status: string | null;
  latest_attendance_date: string | null;
  fee_due: number;
  next_fee_month: string | null;
  next_fee_due_date: string | null;
}

type ChildrenResponse = { children: ParentChildDetails[] };

export default function MyChildrenPage() {
  const [children, setChildren] = React.useState<ParentChildDetails[]>([]);
  const [selectedChildId, setSelectedChildId] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let mounted = true;

    requestDashboardApi<ChildrenResponse>('/api/children')
      .then((payload) => {
        if (!mounted) return;
        setChildren(payload.children);
        setSelectedChildId(payload.children[0]?.id || '');
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Unable to load linked children.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const selectedChild = children.find((child) => child.id === selectedChildId) || children[0] || null;
  const totalFeeDue = children.reduce((sum, child) => sum + Number(child.fee_due || 0), 0);
  const averageAttendance = children.length
    ? Math.round(
        children.reduce((sum, child) => sum + (child.attendance_percentage ?? 0), 0) /
          children.filter((child) => child.attendance_percentage !== null).length || 0,
      )
    : 0;

  return (
    <ProtectedRoute allowedRoles={['PARENT']}>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="My Children" />

        {error && (
          <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900">
            Loading linked children...
          </div>
        ) : !children.length ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            No children are linked to your parent account yet. Please contact the school office.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <MetricCard icon={<GraduationCap className="h-5 w-5" />} label="Linked Children" value={String(children.length)} />
              <MetricCard icon={<CalendarCheck className="h-5 w-5" />} label="Avg Attendance" value={`${averageAttendance}%`} />
              <MetricCard icon={<ReceiptText className="h-5 w-5" />} label="Total Fee Due" value={`Rs. ${totalFeeDue.toLocaleString()}`} />
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
              <div className="min-w-0 space-y-3">
                {children.map((child) => {
                  const isActive = child.id === selectedChild?.id;
                  return (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => setSelectedChildId(child.id)}
                      className={`w-full rounded-lg border p-4 text-left transition ${
                        isActive
                          ? 'border-brand-500 bg-brand-50 shadow-sm dark:bg-brand-950/30'
                          : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <ChildAvatar child={child} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{child.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {child.class_name || 'No class'} · Roll {child.roll_number}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <MiniStat label="Attendance" value={child.attendance_percentage === null ? 'N/A' : `${child.attendance_percentage}%`} />
                        <MiniStat label="Fee Due" value={`Rs. ${child.fee_due.toLocaleString()}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedChild && <ChildDetails child={selectedChild} />}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}

function ChildDetails({ child }: { child: ParentChildDetails }) {
  const attendanceStatus = ATTENDANCE_STATUSES.find((item) => item.value === child.latest_attendance_status);

  return (
    <div className="min-w-0 space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <ChildAvatar child={child} size="lg" />
            <div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{child.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {child.class_name || 'No class assigned'} · Roll No {child.roll_number}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Father / Guardian: {child.father_name || 'N/A'}</p>
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Student ID</p>
            <p className="font-mono font-semibold text-gray-900 dark:text-white">{child.legacy_id || child.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoPanel label="Attendance" value={child.attendance_percentage === null ? 'No records' : `${child.attendance_percentage}%`} helper={`${child.attendance_total} marked day${child.attendance_total === 1 ? '' : 's'}`} />
        <InfoPanel label="Latest Status" value={attendanceStatus?.label || child.latest_attendance_status || 'No record'} helper={child.latest_attendance_date || 'Attendance not submitted'} tone={attendanceStatus?.classes} />
        <InfoPanel label="Monthly Fee" value={`Rs. ${child.monthly_fee.toLocaleString()}`} helper="Current assigned fee" />
        <InfoPanel label="Fee Due" value={`Rs. ${child.fee_due.toLocaleString()}`} helper={child.next_fee_month ? `${child.next_fee_month} · Due ${child.next_fee_due_date || '-'}` : 'No challan due'} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Academic Details</h3>
          <div className="mt-4 space-y-3">
            <DetailRow icon={<GraduationCap className="h-4 w-4" />} label="Class" value={child.class_name || 'Not assigned'} />
            <DetailRow icon={<UserRound className="h-4 w-4" />} label="Class Teacher" value={child.class_teacher_name || 'Not assigned'} />
            <DetailRow icon={<Building2 className="h-4 w-4" />} label="Branch" value={child.branch_name || 'Not assigned'} />
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Contact Details</h3>
          <div className="mt-4 space-y-3">
            <DetailRow icon={<Mail className="h-4 w-4" />} label="Student Email" value={child.email || 'N/A'} />
            <DetailRow icon={<Phone className="h-4 w-4" />} label="Student Phone" value={child.phone_number || 'N/A'} />
            <DetailRow icon={<Phone className="h-4 w-4" />} label="Branch Phone" value={child.branch_phone_number || 'N/A'} />
          </div>
        </section>
      </div>
    </div>
  );
}

function ChildAvatar({ child, size = 'md' }: { child: ParentChildDetails; size?: 'md' | 'lg' }) {
  const dimensions = size === 'lg' ? 'h-16 w-16' : 'h-11 w-11';
  const src = getProfileImageSrc(child.profile_image, child.name, 'Student');

  return (
    <div className={`${dimensions} relative shrink-0 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700`}>
      <Image src={src} alt={child.name} fill className="object-cover" sizes={size === 'lg' ? '64px' : '44px'} />
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-300">{icon}</div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
      <p className="text-[11px] text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function InfoPanel({ label, value, helper, tone }: { label: string; value: string; helper: string; tone?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-2 text-lg font-semibold text-gray-900 dark:text-white ${tone || ''}`}>{value}</p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helper}</p>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
      <div className="mt-0.5 text-gray-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="break-words text-sm font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
