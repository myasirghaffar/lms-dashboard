'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { ATTENDANCE_STATUSES } from '@/lib/attendance';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { AttendanceSessionRecord } from '@/types/attendance';

type AttendanceListResponse = { sessions: AttendanceSessionRecord[] };

export default function MyChildrenAttendancePage() {
  const [sessions, setSessions] = React.useState<AttendanceSessionRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let mounted = true;
    requestDashboardApi<AttendanceListResponse>('/api/attendance')
      .then((payload) => {
        if (mounted) setSessions(payload.sessions);
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Unable to load children attendance.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const childRows = React.useMemo(() => {
    return sessions.flatMap((session) =>
      session.students.map((student) => ({
        ...student,
        class_name: session.class_name,
        attendance_date: session.attendance_date,
        teacher_name: session.teacher_name,
      })),
    );
  }, [sessions]);

  return (
    <ProtectedRoute allowedRoles={['PARENT']}>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Children Attendance" />

        {error && (
          <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900">
            Loading attendance...
          </div>
        ) : !childRows.length ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900">
            No attendance records are available for your children yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Child</th>
                  <th className="px-4 py-3 text-left">Class</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {childRows.map((row) => {
                  const status = ATTENDANCE_STATUSES.find((item) => item.value === row.status);
                  return (
                    <tr key={`${row.attendance_date}-${row.id}`}>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{row.attendance_date}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Roll No: {row.roll_number}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.class_name || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-lg border px-2 py-1 text-xs font-semibold ${status?.classes || ''}`}>
                          {status?.label || row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{row.remarks || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
