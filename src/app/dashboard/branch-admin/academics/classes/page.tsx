'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { BookOpen, Building2, Clock, MoreHorizontal, Search, Users } from 'lucide-react';
import ClassModal, { ClassFormValues } from '@/components/dashboard/academics/ClassModal';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { BranchRecord } from '@/types/branches';
import type { SchoolClassRecord, SystemUserRecord } from '@/types/user-management';

type ClassesResponse = { classes: SchoolClassRecord[] };
type ClassResponse = { class: SchoolClassRecord };
type UsersResponse = { users: SystemUserRecord[] };
type BranchesResponse = { branches: BranchRecord[] };

export default function ClassesPage() {
    const [classes, setClasses] = React.useState<SchoolClassRecord[]>([]);
    const [teachers, setTeachers] = React.useState<SystemUserRecord[]>([]);
    const [branches, setBranches] = React.useState<BranchRecord[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingClass, setEditingClass] = React.useState<SchoolClassRecord | null>(null);
    const [deletingClass, setDeletingClass] = React.useState<SchoolClassRecord | null>(null);
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
    const [saving, setSaving] = React.useState(false);

    const loadData = React.useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [classesPayload, teachersPayload, branchesPayload] = await Promise.all([
                requestDashboardApi<ClassesResponse>('/api/classes'),
                requestDashboardApi<UsersResponse>('/api/users?role=TEACHER'),
                requestDashboardApi<BranchesResponse>('/api/branches'),
            ]);
            setClasses(classesPayload.classes);
            setTeachers(teachersPayload.users);
            setBranches(branchesPayload.branches);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load classes.');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredClasses = classes.filter((classRecord) => {
        const haystack = [
            classRecord.name,
            classRecord.teacher_name,
            classRecord.branch_name,
            classRecord.room_number,
        ].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(searchTerm.toLowerCase());
    });

    const openCreateModal = () => {
        setEditingClass(null);
        setIsModalOpen(true);
    };

    const openEditModal = (classRecord: SchoolClassRecord) => {
        setEditingClass(classRecord);
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const handleSubmit = async (values: ClassFormValues) => {
        setSaving(true);
        try {
            const payload = {
                ...values,
                capacity: values.capacity === '' ? null : values.capacity,
            };
            const response = editingClass
                ? await requestDashboardApi<ClassResponse>(`/api/classes/${editingClass.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(payload),
                })
                : await requestDashboardApi<ClassResponse>('/api/classes', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });

            setClasses((current) => editingClass
                ? current.map((item) => item.id === response.class.id ? response.class : item)
                : [response.class, ...current]);
            setIsModalOpen(false);
            setEditingClass(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to save class.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingClass) return;
        try {
            await requestDashboardApi<{ success: boolean }>(`/api/classes/${deletingClass.id}`, { method: 'DELETE' });
            setClasses((current) => current.filter((item) => item.id !== deletingClass.id));
            setDeletingClass(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to delete class.');
        }
    };

    return (
        <ProtectedRoute allowedRoles={['BRANCH_ADMIN', 'SUPER_ADMIN']}>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Classes</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage academic classes, branches, class teachers, and rooms</p>
                    </div>
                    <button onClick={openCreateModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Add Class
                    </button>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                        {error}
                    </div>
                )}

                <ClassModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingClass(null);
                    }}
                    onSubmit={handleSubmit}
                    classRecord={editingClass}
                    teachers={teachers}
                    branches={branches}
                    isSubmitting={saving}
                />

                <ConfirmModal
                    isOpen={Boolean(deletingClass)}
                    onClose={() => setDeletingClass(null)}
                    onConfirm={handleDelete}
                    title="Delete Class"
                    message={`Delete ${deletingClass?.name || 'this class'}? This will also remove linked subject and timetable assignments if the database allows it.`}
                />

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search classes, teachers, branches, rooms..."
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-md dark:bg-gray-800 dark:text-gray-400">Loading classes...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredClasses.map((classRecord) => (
                            <div key={classRecord.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="relative">
                                        <button onClick={() => setOpenMenuId(openMenuId === classRecord.id ? null : classRecord.id)} className="dropdown-toggle text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                        <Dropdown isOpen={openMenuId === classRecord.id} onClose={() => setOpenMenuId(null)} className="w-36">
                                            <DropdownItem onClick={() => openEditModal(classRecord)}>Edit</DropdownItem>
                                            <DropdownItem onClick={() => {
                                                setDeletingClass(classRecord);
                                                setOpenMenuId(null);
                                            }} className="text-red-600 hover:text-red-700">Delete</DropdownItem>
                                        </Dropdown>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{classRecord.name}</h3>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                        <Users className="w-4 h-4 mr-2" />
                                        {classRecord.teacher_name || 'No class teacher assigned'}
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                        <Building2 className="w-4 h-4 mr-2" />
                                        {classRecord.branch_name || 'No branch selected'}
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {classRecord.student_count || 0} students{classRecord.capacity ? ` / ${classRecord.capacity}` : ''} {classRecord.room_number ? `- ${classRecord.room_number}` : ''}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredClasses.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700">
                                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No classes found</h3>
                                <p className="text-gray-500 mt-1">Create a class and link it to a branch and teacher.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
