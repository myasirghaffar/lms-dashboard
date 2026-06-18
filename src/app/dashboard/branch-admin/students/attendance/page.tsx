'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { ATTENDANCE_STATUSES } from '@/lib/attendance';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { AttendanceSessionRecord } from '@/types/attendance';
import { CalendarCheck, Users } from 'lucide-react';

type AttendanceListResponse = { sessions: AttendanceSessionRecord[] };

export default function StudentAttendancePage() {
  const [sessions, setSessions] = React.useState<AttendanceSessionRecord[]>([]);
  const [selectedSessionId, setSelectedSessionId] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let mounted = true;
    requestDashboardApi<AttendanceListResponse>('/api/attendance')
      .then((payload) => {
        if (!mounted) return;
        setSessions(payload.sessions);
        setSelectedSessionId(payload.sessions[0]?.id || '');
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Unable to load attendance records.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const selectedSession = sessions.find((session) => session.id === selectedSessionId) || sessions[0] || null;

  return (
    <ProtectedRoute allowedRoles={['BRANCH_ADMIN', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Student Attendance" />

        {error && (
          <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900">
            Loading attendance records...
          </div>
        ) : !sessions.length ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900">
            No attendance records have been submitted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_1fr]">
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Recent Sessions</p>
              <div className="mt-3 space-y-2">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                      session.id === selectedSession?.id
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'
                    }`}
                  >
                    <span className="block font-semibold">{session.class_name || 'Class'}</span>
                    <span className="text-xs">{session.attendance_date} · {session.present_count}/{session.total_students} present</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedSession && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <Metric label="Class" value={selectedSession.class_name || '-'} icon={<Users className="h-5 w-5" />} />
                  <Metric label="Date" value={selectedSession.attendance_date} icon={<CalendarCheck className="h-5 w-5" />} />
                  <Metric label="Teacher" value={selectedSession.teacher_name || '-'} />
                  <Metric label="Present" value={`${selectedSession.present_count}/${selectedSession.total_students}`} />
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      <tr>
                        <th className="px-4 py-3 text-left">Roll No</th>
                        <th className="px-4 py-3 text-left">Student</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {selectedSession.students.map((student) => {
                        const status = ATTENDANCE_STATUSES.find((item) => item.value === student.status);
                        return (
                          <tr key={student.id}>
                            <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{student.roll_number}</td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white">{student.name}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-lg border px-2 py-1 text-xs font-semibold ${status?.classes || ''}`}>
                                {status?.label || student.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{student.remarks || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        {icon && <div className="text-brand-600 dark:text-brand-300">{icon}</div>}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
