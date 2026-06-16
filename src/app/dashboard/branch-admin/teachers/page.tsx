'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { BookOpen, Building2, Edit3, Mail, MapPin, MoreHorizontal, Phone, Search, Trash2, Users } from 'lucide-react';
import UserModal from '@/components/dashboard/users/UserModal';
import Image from 'next/image';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { TeacherManagementRecord } from '@/types/user-management';
import type { UserFormValues } from '@/components/dashboard/users/UserModal';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';
import type { BranchRecord } from '@/types/branches';
import { getProfileImageSrc } from '@/lib/profileImage';

export default function TeachersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [teachers, setTeachers] = useState<TeacherManagementRecord[]>([]);
    const [branches, setBranches] = useState<BranchRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [editingTeacher, setEditingTeacher] = useState<TeacherManagementRecord | null>(null);
    const [deletingTeacher, setDeletingTeacher] = useState<TeacherManagementRecord | null>(null);

    const loadTeachers = React.useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const [teachersPayload, branchesPayload] = await Promise.all([
                requestDashboardApi<{ teachers: TeacherManagementRecord[] }>('/api/teachers'),
                requestDashboardApi<{ branches: BranchRecord[] }>('/api/branches'),
            ]);
            setTeachers(teachersPayload.teachers);
            setBranches(branchesPayload.branches);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to load teachers.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        void loadTeachers();
    }, [loadTeachers]);

    const openCreateModal = () => {
        setEditingTeacher(null);
        setIsModalOpen(true);
    };

    const openEditModal = (teacher: TeacherManagementRecord) => {
        setOpenMenuId(null);
        setEditingTeacher(teacher);
        setIsModalOpen(true);
    };

    const handleSaveTeacher = async (values: UserFormValues) => {
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            if (editingTeacher) {
                await requestDashboardApi<{ teacher: TeacherManagementRecord }>(`/api/teachers/${editingTeacher.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(values),
                });
            } else {
                await requestDashboardApi<{ teacher: TeacherManagementRecord }>('/api/teachers', {
                    method: 'POST',
                    body: JSON.stringify(values),
                });
            }
            setIsModalOpen(false);
            setEditingTeacher(null);
            await loadTeachers();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to save teacher.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTeacher = async () => {
        if (!deletingTeacher) return;
        setErrorMessage('');

        try {
            await requestDashboardApi<{ success: boolean }>(`/api/teachers/${deletingTeacher.id}`, { method: 'DELETE' });
            setTeachers((current) => current.filter((teacher) => teacher.id !== deletingTeacher.id));
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to delete teacher.');
        } finally {
            setDeletingTeacher(null);
        }
    };

    const teacherList = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.specialization && teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <ProtectedRoute allowedRoles={['BRANCH_ADMIN', 'SUPER_ADMIN']}>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teachers</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage teaching staff and assignments</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Users className="w-4 h-4" />
                        Add Teacher
                    </button>
                </div>

                <UserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    roleType="TEACHER"
                    mode={editingTeacher ? 'edit' : 'add'}
                    initialData={editingTeacher}
                    onSubmit={handleSaveTeacher}
                    isSubmitting={isSubmitting}
                    branches={branches}
                />

                <ConfirmModal
                    isOpen={Boolean(deletingTeacher)}
                    onClose={() => setDeletingTeacher(null)}
                    onConfirm={handleDeleteTeacher}
                    title="Delete Teacher"
                    message={`Are you sure you want to delete ${deletingTeacher?.name || 'this teacher'}?`}
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
                            placeholder="Search teachers..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading && [1, 2, 3].map((item) => (
                        <div key={item} className="h-72 animate-pulse rounded-xl bg-white shadow-md dark:bg-gray-800" />
                    ))}

                    {!isLoading && teacherList.map((teacher) => (
                        <div key={teacher.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="relative w-12 h-12">
                                        <Image
                                            src={getProfileImageSrc(teacher.profile_image, teacher.name, 'Teacher')}
                                            alt={teacher.name}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{teacher.name}</h3>
                                        {teacher.specialization && (
                                            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full w-fit mt-1">
                                                <BookOpen className="w-3 h-3" />
                                                {teacher.specialization}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenMenuId((current) => current === teacher.id ? null : teacher.id)}
                                        className="dropdown-toggle text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        aria-label={`Open ${teacher.name} actions`}
                                    >
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                    <Dropdown isOpen={openMenuId === teacher.id} onClose={() => setOpenMenuId(null)} className="w-44">
                                        <DropdownItem onClick={() => openEditModal(teacher)} className="flex items-center gap-2">
                                            <Edit3 className="h-4 w-4" />
                                            Edit Teacher
                                        </DropdownItem>
                                        <DropdownItem
                                            onClick={() => {
                                                setOpenMenuId(null);
                                                setDeletingTeacher(teacher);
                                            }}
                                            className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete Teacher
                                        </DropdownItem>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {teacher.email}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {teacher.phone_number || 'N/A'}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {teacher.address || 'N/A'}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Building2 className="w-4 h-4 mr-2" />
                                    {teacher.branch_name || 'Unassigned branch'}
                                </div>
                            </div>
                        </div>
                    ))}
                    {!isLoading && teacherList.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Teachers found</h3>
                            <p className="text-gray-500 mt-1">Create a new teacher via the &apos;Add Teacher&apos; button.</p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
