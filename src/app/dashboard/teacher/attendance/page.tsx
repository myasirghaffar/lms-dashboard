'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import { ATTENDANCE_STATUSES, getTodayIsoDate, summarizeAttendance } from '@/lib/attendance';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { AttendanceSessionRecord, AttendanceStatus } from '@/types/attendance';
import type { SchoolClassRecord } from '@/types/user-management';
import { CalendarDays, CheckCheck, ClipboardCheck, Save, Search, Users } from 'lucide-react';

type ClassesResponse = { classes: SchoolClassRecord[] };
type AttendanceResponse = { session: AttendanceSessionRecord };

export default function AttendanceMarkingPage() {
  const [classes, setClasses] = React.useState<SchoolClassRecord[]>([]);
  const [selectedClassId, setSelectedClassId] = React.useState('');
  const [attendanceDate, setAttendanceDate] = React.useState(getTodayIsoDate());
  const [session, setSession] = React.useState<AttendanceSessionRecord | null>(null);
  const [query, setQuery] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [loadingClasses, setLoadingClasses] = React.useState(true);
  const [loadingRoster, setLoadingRoster] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    let mounted = true;
    requestDashboardApi<ClassesResponse>('/api/classes')
      .then((payload) => {
        if (!mounted) return;
        setClasses(payload.classes);
        setSelectedClassId(payload.classes[0]?.id || '');
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Unable to load assigned classes.');
      })
      .finally(() => {
        if (mounted) setLoadingClasses(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!selectedClassId) return;

    let mounted = true;
    setLoadingRoster(true);
    setError('');
    setMessage('');

    requestDashboardApi<AttendanceResponse>(`/api/attendance?class_id=${selectedClassId}&date=${attendanceDate}`)
      .then((payload) => {
        if (!mounted) return;
        setSession(payload.session);
        setNotes(payload.session.notes || '');
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Unable to load attendance roster.');
      })
      .finally(() => {
        if (mounted) setLoadingRoster(false);
      });

    return () => {
      mounted = false;
    };
  }, [selectedClassId, attendanceDate]);

  const filteredStudents = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!session?.students) return [];
    if (!term) return session.students;
    return session.students.filter((student) =>
      [student.name, student.roll_number, student.father_name || ''].some((value) => value.toLowerCase().includes(term)),
    );
  }, [query, session]);

  const summary = React.useMemo(() => summarizeAttendance(session?.students || []), [session]);
  const selectedClass = classes.find((classRecord) => classRecord.id === selectedClassId);

  const updateStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setSession((current) => {
      if (!current) return current;
      return {
        ...current,
        students: current.students.map((student) => (student.id === studentId ? { ...student, status } : student)),
      };
    });
  };

  const updateRemarks = (studentId: string, remarks: string) => {
    setSession((current) => {
      if (!current) return current;
      return {
        ...current,
        students: current.students.map((student) => (student.id === studentId ? { ...student, remarks } : student)),
      };
    });
  };

  const markAll = (status: AttendanceStatus) => {
    setSession((current) => {
      if (!current) return current;
      return {
        ...current,
        students: current.students.map((student) => ({ ...student, status })),
      };
    });
  };

  const saveAttendance = async (status: 'draft' | 'submitted') => {
    if (!session || !selectedClassId) return;
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const payload = await requestDashboardApi<AttendanceResponse>('/api/attendance', {
        method: 'POST',
        body: JSON.stringify({
          class_id: selectedClassId,
          attendance_date: attendanceDate,
          status,
          notes,
          records: session.students.map((student) => ({
            student_id: student.id,
            status: student.status,
            remarks: student.remarks,
          })),
        }),
      });
      setSession(payload.session);
      setNotes(payload.session.notes || '');
      setMessage(status === 'submitted' ? 'Attendance submitted successfully.' : 'Attendance draft saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['TEACHER']}>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Mark Attendance" />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-300">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Class</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedClass?.name || 'No class selected'}</p>
              </div>
            </div>
          </div>
          <SummaryCard label="Present" value={summary.present} tone="emerald" />
          <SummaryCard label="Absent" value={summary.absent} tone="rose" />
          <SummaryCard label="Late / Excused" value={summary.late + summary.excused} tone="amber" />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_180px_1fr]">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Assigned Class</label>
              <select
                value={selectedClassId}
                onChange={(event) => setSelectedClassId(event.target.value)}
                disabled={loadingClasses}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                {classes.map((classRecord) => (
                  <option key={classRecord.id} value={classRecord.id}>
                    {classRecord.name} {classRecord.branch_name ? `- ${classRecord.branch_name}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Date</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(event) => setAttendanceDate(event.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Search Students</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search name, roll no, father name"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 pl-10 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => markAll('PRESENT')} disabled={!session || saving}>
              <CheckCheck className="h-4 w-4" />
              Mark All Present
            </Button>
            <Button size="sm" variant="outline" onClick={() => markAll('ABSENT')} disabled={!session || saving}>
              Mark All Absent
            </Button>
            <Button size="sm" variant="outline" onClick={() => setAttendanceDate(getTodayIsoDate())}>
              <CalendarDays className="h-4 w-4" />
              Today
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
            {message}
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Class Roster</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {session?.class_name || selectedClass?.name || 'Select a class'} · {attendanceDate} · {summary.total} students
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => saveAttendance('draft')} disabled={!session || saving}>
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button size="sm" onClick={() => saveAttendance('submitted')} disabled={!session || saving}>
                <ClipboardCheck className="h-4 w-4" />
                {saving ? 'Saving...' : 'Submit Attendance'}
              </Button>
            </div>
          </div>

          {loadingRoster ? (
            <div className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">Loading roster...</div>
          ) : !selectedClassId ? (
            <div className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No class is assigned to your account.</div>
          ) : filteredStudents.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No students found for this class/date.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 text-left">Roll No</th>
                    <th className="px-4 py-3 text-left">Student</th>
                    <th className="px-4 py-3 text-left">Attendance</th>
                    <th className="px-4 py-3 text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="align-top">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">{student.roll_number}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Father: {student.father_name || 'N/A'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {ATTENDANCE_STATUSES.map((status) => {
                            const active = student.status === status.value;
                            return (
                              <button
                                key={status.value}
                                type="button"
                                onClick={() => updateStudentStatus(student.id, status.value)}
                                className={`h-9 rounded-lg border px-3 text-xs font-semibold transition ${
                                  active
                                    ? status.classes
                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
                                }`}
                              >
                                {status.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={student.remarks}
                          onChange={(event) => updateRemarks(student.id, event.target.value)}
                          placeholder="Optional note"
                          className="h-9 w-full min-w-48 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-gray-100 p-4 dark:border-gray-800">
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">Class Notes</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              placeholder="Optional notes for this attendance session"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: 'emerald' | 'rose' | 'amber' }) {
  const toneClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-2 inline-flex rounded-lg px-3 py-1 text-2xl font-bold ${toneClasses[tone]}`}>{value}</p>
    </div>
  );
}
