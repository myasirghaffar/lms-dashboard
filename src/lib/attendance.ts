import type { AttendanceStatus } from '@/types/attendance';

export const ATTENDANCE_STATUSES: Array<{
  value: AttendanceStatus;
  label: string;
  shortLabel: string;
  classes: string;
}> = [
  {
    value: 'PRESENT',
    label: 'Present',
    shortLabel: 'P',
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300',
  },
  {
    value: 'ABSENT',
    label: 'Absent',
    shortLabel: 'A',
    classes: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300',
  },
  {
    value: 'LATE',
    label: 'Late',
    shortLabel: 'L',
    classes: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300',
  },
  {
    value: 'EXCUSED',
    label: 'Excused',
    shortLabel: 'E',
    classes: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300',
  },
];

export function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function summarizeAttendance(records: Array<{ status: AttendanceStatus }>) {
  return records.reduce(
    (summary, record) => {
      summary.total += 1;
      if (record.status === 'PRESENT') summary.present += 1;
      if (record.status === 'ABSENT') summary.absent += 1;
      if (record.status === 'LATE') summary.late += 1;
      if (record.status === 'EXCUSED') summary.excused += 1;
      return summary;
    },
    { total: 0, present: 0, absent: 0, late: 0, excused: 0 },
  );
}
