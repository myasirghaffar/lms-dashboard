'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Search, Filter, GraduationCap, Eye, Edit, Trash2 } from 'lucide-react';
import StudentModal from '@/components/dashboard/students/StudentModal';
import Image from 'next/image';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { SchoolClassRecord, StudentManagementRecord } from '@/types/user-management';
import type { StudentFormValues } from '@/components/dashboard/students/StudentModal';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';

export default function StudentsPage() {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        mode: 'add' | 'edit' | 'view';
        selectedData: any | null;
    }>({
        isOpen: false,
        mode: 'add',
        selectedData: null,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState<StudentManagementRecord[]>([]);
    const [classes, setClasses] = useState<SchoolClassRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [deletingStudent, setDeletingStudent] = useState<StudentManagementRecord | null>(null);

    const loadStudents = React.useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const [studentsPayload, classesPayload] = await Promise.all([
                requestDashboardApi<{ students: StudentManagementRecord[] }>('/api/students'),
                requestDashboardApi<{ classes: SchoolClassRecord[] }>('/api/classes'),
            ]);
            setStudents(studentsPayload.students);
            setClasses(classesPayload.classes);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to load students.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        void loadStudents();
    }, [loadStudents]);

    const handleOpenModal = (mode: 'add' | 'edit' | 'view', data: StudentManagementRecord | null = null) => {
        setModalState({
            isOpen: true,
            mode,
            selectedData: data,
        });
    };

    const handleSaveStudent = async (values: StudentFormValues) => {
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            if (modalState.mode === 'edit' && modalState.selectedData) {
                await requestDashboardApi<{ student: StudentManagementRecord }>(`/api/students/${modalState.selectedData.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(values),
                });
            } else {
                await requestDashboardApi<{ student: StudentManagementRecord }>('/api/students', {
                    method: 'POST',
                    body: JSON.stringify(values),
                });
            }
            setModalState({ isOpen: false, mode: 'add', selectedData: null });
            await loadStudents();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to save student.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteStudent = async () => {
        if (!deletingStudent) return;
        setErrorMessage('');

        try {
            await requestDashboardApi<{ success: boolean }>(`/api/students/${deletingStudent.id}`, { method: 'DELETE' });
            setStudents((current) => current.filter((student) => student.id !== deletingStudent.id));
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to delete student.');
        } finally {
            setDeletingStudent(null);
        }
    };

    const studentList = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roll_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.class_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute allowedRoles={['BRANCH_ADMIN', 'SUPER_ADMIN']}>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage student enrollment and records</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal('add')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <GraduationCap className="w-4 h-4" />
                        Add Student
                    </button>
                </div>

                <StudentModal
                    isOpen={modalState.isOpen}
                    onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                    mode={modalState.mode}
                    initialData={modalState.selectedData}
                    classes={classes}
                    onSubmit={handleSaveStudent}
                    isSubmitting={isSubmitting}
                />

                <ConfirmModal
                    isOpen={Boolean(deletingStudent)}
                    onClose={() => setDeletingStudent(null)}
                    onConfirm={handleDeleteStudent}
                    title="Delete Student"
                    message={`Are you sure you want to delete ${deletingStudent?.name || 'this student'}?`}
                    confirmText="Delete"
                    variant="danger"
                />

                {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                        {errorMessage}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Roll No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parent</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {isLoading && [1, 2, 3, 4, 5].map((item) => (
                                    <tr key={item}>
                                        <td colSpan={5} className="px-6 py-4">
                                            <div className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700" />
                                        </td>
                                    </tr>
                                ))}

                                {!isLoading && studentList.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                                                    <Image
                                                        src={student.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`}
                                                        alt={student.name}
                                                        fill
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            {student.roll_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                                                {student.class_name || 'Unassigned'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            {student.parent_name || student.father_name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal('view', student)}
                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-blue-600 transition"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal('edit', student)}
                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-yellow-600 transition"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingStudent(student)}
                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-red-600 transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!isLoading && studentList.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            No students found matching your search.
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
