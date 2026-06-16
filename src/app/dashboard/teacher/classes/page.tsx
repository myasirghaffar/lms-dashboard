'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { BookOpen, Building2, Clock, Users } from 'lucide-react';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { SchoolClassRecord } from '@/types/user-management';

type ClassesResponse = { classes: SchoolClassRecord[] };

export default function MyClassesPage() {
    const [classes, setClasses] = React.useState<SchoolClassRecord[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        let mounted = true;
        requestDashboardApi<ClassesResponse>('/api/classes')
            .then((payload) => {
                if (mounted) setClasses(payload.classes);
            })
            .catch((err) => {
                if (mounted) setError(err instanceof Error ? err.message : 'Unable to load your classes.');
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <ProtectedRoute allowedRoles={['TEACHER']}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Classes</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">View your assigned classes and rooms</p>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-md dark:bg-gray-800 dark:text-gray-400">Loading classes...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((classRecord) => (
                            <div key={classRecord.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{classRecord.name}</h3>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                        <Users className="w-4 h-4 mr-2" />
                                        {classRecord.student_count || 0} students{classRecord.capacity ? ` / ${classRecord.capacity}` : ''}
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                        <Building2 className="w-4 h-4 mr-2" />
                                        {classRecord.branch_name || 'No branch selected'}
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {classRecord.room_number || 'Room not assigned'}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {classes.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700">
                                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Assigned Classes</h3>
                                <p className="text-gray-500 mt-1">You are not assigned to any classes yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
