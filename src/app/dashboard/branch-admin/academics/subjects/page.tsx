'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Book, Layers, MoreHorizontal, Search, User } from 'lucide-react';
import SubjectModal, { SubjectFormValues } from '@/components/dashboard/academics/SubjectModal';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { SchoolClassRecord, SubjectRecord, SystemUserRecord } from '@/types/user-management';

type SubjectsResponse = { subjects: SubjectRecord[] };
type SubjectResponse = { subject: SubjectRecord };
type ClassesResponse = { classes: SchoolClassRecord[] };
type UsersResponse = { users: SystemUserRecord[] };

export default function SubjectsPage() {
    const [subjects, setSubjects] = React.useState<SubjectRecord[]>([]);
    const [classes, setClasses] = React.useState<SchoolClassRecord[]>([]);
    const [teachers, setTeachers] = React.useState<SystemUserRecord[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingSubject, setEditingSubject] = React.useState<SubjectRecord | null>(null);
    const [deletingSubject, setDeletingSubject] = React.useState<SubjectRecord | null>(null);
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
    const [saving, setSaving] = React.useState(false);

    const loadData = React.useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [subjectsPayload, classesPayload, teachersPayload] = await Promise.all([
                requestDashboardApi<SubjectsResponse>('/api/subjects'),
                requestDashboardApi<ClassesResponse>('/api/classes'),
                requestDashboardApi<UsersResponse>('/api/users?role=TEACHER'),
            ]);
            setSubjects(subjectsPayload.subjects);
            setClasses(classesPayload.classes);
            setTeachers(teachersPayload.users);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load subjects.');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredSubjects = subjects.filter((subject) => {
        const haystack = [
            subject.name,
            subject.class_name,
            subject.teacher_name,
            subject.branch_name,
            subject.description,
        ].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(searchTerm.toLowerCase());
    });

    const openCreateModal = () => {
        setEditingSubject(null);
        setIsModalOpen(true);
    };

    const openEditModal = (subject: SubjectRecord) => {
        setEditingSubject(subject);
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const handleSubmit = async (values: SubjectFormValues) => {
        setSaving(true);
        try {
            const response = editingSubject
                ? await requestDashboardApi<SubjectResponse>(`/api/subjects/${editingSubject.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(values),
                })
                : await requestDashboardApi<SubjectResponse>('/api/subjects', {
                    method: 'POST',
                    body: JSON.stringify(values),
                });
            setSubjects((current) => editingSubject
                ? current.map((item) => item.id === response.subject.id ? response.subject : item)
                : [response.subject, ...current]);
            setIsModalOpen(false);
            setEditingSubject(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to save subject.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingSubject) return;
        try {
            await requestDashboardApi<{ success: boolean }>(`/api/subjects/${deletingSubject.id}`, { method: 'DELETE' });
            setSubjects((current) => current.filter((item) => item.id !== deletingSubject.id));
            setDeletingSubject(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to delete subject.');
        }
    };

    return (
        <ProtectedRoute allowedRoles={['BRANCH_ADMIN', 'SUPER_ADMIN']}>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subjects</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage subjects and connect them with classes and teachers</p>
                    </div>
                    <button onClick={openCreateModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                        <Book className="w-4 h-4" />
                        Add Subject
                    </button>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                        {error}
                    </div>
                )}

                <SubjectModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingSubject(null);
                    }}
                    onSubmit={handleSubmit}
                    subject={editingSubject}
                    classes={classes}
                    teachers={teachers}
                    isSubmitting={saving}
                />

                <ConfirmModal
                    isOpen={Boolean(deletingSubject)}
                    onClose={() => setDeletingSubject(null)}
                    onConfirm={handleDelete}
                    title="Delete Subject"
                    message={`Delete ${deletingSubject?.name || 'this subject'}? Timetable periods linked to it may also need to be updated.`}
                />

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search subjects, classes, teachers..."
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teacher</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Loading subjects...</td>
                                    </tr>
                                ) : filteredSubjects.length ? filteredSubjects.map((subject) => (
                                    <tr key={subject.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <Book className="w-4 h-4 mt-1 text-blue-500" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{subject.name}</p>
                                                    {subject.description && <p className="text-sm text-gray-500 dark:text-gray-400">{subject.description}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center">
                                                <Layers className="w-4 h-4 mr-2 text-gray-400" />
                                                {subject.class_name || 'Unassigned'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                <User className="w-4 h-4 mr-2 text-gray-400" />
                                                {subject.teacher_name || 'Unassigned'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="relative inline-block">
                                                <button onClick={() => setOpenMenuId(openMenuId === subject.id ? null : subject.id)} className="dropdown-toggle text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                                <Dropdown isOpen={openMenuId === subject.id} onClose={() => setOpenMenuId(null)} className="w-36">
                                                    <DropdownItem onClick={() => openEditModal(subject)}>Edit</DropdownItem>
                                                    <DropdownItem onClick={() => {
                                                        setDeletingSubject(subject);
                                                        setOpenMenuId(null);
                                                    }} className="text-red-600 hover:text-red-700">Delete</DropdownItem>
                                                </Dropdown>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            No subjects found.
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
