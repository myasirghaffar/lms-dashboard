'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { BookOpen, CalendarDays, Clock, MapPin, User } from 'lucide-react';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { TimetableEntryRecord } from '@/types/user-management';

type TimetableResponse = { entries: TimetableEntryRecord[] };

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function sortEntries(entries: TimetableEntryRecord[]) {
    return [...entries].sort((a, b) => {
        const dayDelta = DAY_ORDER.indexOf(a.day_of_week) - DAY_ORDER.indexOf(b.day_of_week);
        if (dayDelta !== 0) return dayDelta;
        return a.start_time.localeCompare(b.start_time);
    });
}

function formatTime(value: string) {
    return value?.slice(0, 5) || '--:--';
}

export default function StudentTimetablePage() {
    const [entries, setEntries] = React.useState<TimetableEntryRecord[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        let mounted = true;
        requestDashboardApi<TimetableResponse>('/api/timetable')
            .then((payload) => {
                if (mounted) setEntries(sortEntries(payload.entries));
            })
            .catch((err) => {
                if (mounted) setError(err instanceof Error ? err.message : 'Unable to load timetable.');
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <ProtectedRoute allowedRoles={['STUDENT']}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Timetable</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Your weekly class schedule</p>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                        {error}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Day & Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teacher</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Loading timetable...</td>
                                    </tr>
                                ) : entries.length ? entries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-start gap-3">
                                                <CalendarDays className="w-4 h-4 mt-1 text-blue-500" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{entry.day_of_week}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatTime(entry.start_time)} - {formatTime(entry.end_time)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center">
                                                <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                                                {entry.subject_name || 'Subject not assigned'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-2 text-gray-400" />
                                                {entry.teacher_name || 'Teacher not assigned'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                {entry.room_number || 'Room not assigned'}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            No timetable periods assigned yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
