'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Book, Layers, User } from 'lucide-react';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { SubjectRecord } from '@/types/user-management';

type SubjectsResponse = { subjects: SubjectRecord[] };

export default function MySubjectsPage() {
    const [subjects, setSubjects] = React.useState<SubjectRecord[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        let mounted = true;
        requestDashboardApi<SubjectsResponse>('/api/subjects')
            .then((payload) => {
                if (mounted) setSubjects(payload.subjects);
            })
            .catch((err) => {
                if (mounted) setError(err instanceof Error ? err.message : 'Unable to load subjects.');
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Subjects</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Subjects assigned to your class</p>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-md dark:bg-gray-800 dark:text-gray-400">Loading subjects...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {subjects.map((subject) => (
                            <div key={subject.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                                    <Book className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{subject.name}</h3>
                                {subject.description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{subject.description}</p>}
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                        <Layers className="w-4 h-4 mr-2" />
                                        {subject.class_name || 'Class not assigned'}
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                        <User className="w-4 h-4 mr-2" />
                                        {subject.teacher_name || 'Teacher not assigned'}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {subjects.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700">
                                <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Subjects Assigned</h3>
                                <p className="text-gray-500 mt-1">Subjects will appear here when assigned to your class.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
