'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Edit3, GraduationCap, Mail, MapPin, MoreHorizontal, Phone, Trash2, UserRound, Users } from 'lucide-react';
import Image from 'next/image';
import UserModal from '@/components/dashboard/users/UserModal';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { requestDashboardApi } from '@/lib/dashboardApi';
import { getProfileImageSrc } from '@/lib/profileImage';
import type { ParentManagementRecord } from '@/types/user-management';
import type { UserFormValues } from '@/components/dashboard/users/UserModal';

export default function ParentsPage() {
    const [parents, setParents] = React.useState<ParentManagementRecord[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
    const [editingParent, setEditingParent] = React.useState<ParentManagementRecord | null>(null);
    const [deletingParent, setDeletingParent] = React.useState<ParentManagementRecord | null>(null);

    const loadParents = React.useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const payload = await requestDashboardApi<{ parents: ParentManagementRecord[] }>('/api/parents');
            setParents(payload.parents);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to load parents.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        void loadParents();
    }, [loadParents]);

    const openCreateModal = () => {
        setEditingParent(null);
        setIsModalOpen(true);
    };

    const openEditModal = (parent: ParentManagementRecord) => {
        setOpenMenuId(null);
        setEditingParent(parent);
        setIsModalOpen(true);
    };

    const handleSaveParent = async (values: UserFormValues) => {
        setIsSubmitting(true);
        setErrorMessage('');
        const payload = { ...values, role: 'PARENT' };

        try {
            if (editingParent) {
                await requestDashboardApi(`/api/users/${editingParent.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(payload),
                });
            } else {
                await requestDashboardApi('/api/users', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
            }

            setIsModalOpen(false);
            setEditingParent(null);
            await loadParents();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to save parent.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteParent = async () => {
        if (!deletingParent) return;
        setErrorMessage('');

        try {
            await requestDashboardApi(`/api/users/${deletingParent.id}`, { method: 'DELETE' });
            setParents((current) => current.filter((parent) => parent.id !== deletingParent.id));
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to delete parent.');
        } finally {
            setDeletingParent(null);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Parents Management</h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">Manage parents and view their linked children</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                    >
                        <Users className="h-4 w-4" />
                        Add Parent
                    </button>
                </div>

                <UserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    roleType="PARENT"
                    mode={editingParent ? 'edit' : 'add'}
                    initialData={editingParent}
                    onSubmit={handleSaveParent}
                    isSubmitting={isSubmitting}
                />

                <ConfirmModal
                    isOpen={Boolean(deletingParent)}
                    onClose={() => setDeletingParent(null)}
                    onConfirm={handleDeleteParent}
                    title="Delete Parent"
                    message={`Are you sure you want to delete ${deletingParent?.name || 'this parent'}? Linked students will remain in the system but will no longer be assigned to this parent.`}
                    confirmText="Delete"
                    variant="danger"
                />

                {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                        {errorMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {isLoading && [1, 2, 3, 4].map((item) => (
                        <div key={item} className="h-80 animate-pulse rounded-xl bg-white shadow-md dark:bg-gray-800" />
                    ))}

                    {!isLoading && parents.map((parent) => (
                        <div key={parent.id} className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                            <div className="mb-5 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                                        <Image
                                            src={getProfileImageSrc(parent.profile_image, parent.name || 'Parent', 'Parent')}
                                            alt={parent.name || 'Parent'}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{parent.name}</h3>
                                        <div className="mt-1 flex w-fit items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                                            <UserRound className="h-3 w-3" />
                                            Parent
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenMenuId((current) => current === parent.id ? null : parent.id)}
                                        className="dropdown-toggle text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        aria-label={`Open ${parent.name} actions`}
                                    >
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                    <Dropdown isOpen={openMenuId === parent.id} onClose={() => setOpenMenuId(null)} className="w-44">
                                        <DropdownItem onClick={() => openEditModal(parent)} className="flex items-center gap-2">
                                            <Edit3 className="h-4 w-4" />
                                            Edit Parent
                                        </DropdownItem>
                                        <DropdownItem
                                            onClick={() => {
                                                setOpenMenuId(null);
                                                setDeletingParent(parent);
                                            }}
                                            className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete Parent
                                        </DropdownItem>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="grid gap-3 text-sm text-gray-600 dark:text-gray-400 sm:grid-cols-2">
                                <div className="flex items-center">
                                    <Mail className="mr-2 h-4 w-4" />
                                    <span className="truncate">{parent.email}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="mr-2 h-4 w-4" />
                                    {parent.phone_number || 'N/A'}
                                </div>
                                <div className="flex items-center sm:col-span-2">
                                    <MapPin className="mr-2 h-4 w-4 shrink-0" />
                                    <span className="truncate">{parent.address || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="mt-5 border-t border-gray-100 pt-5 dark:border-gray-700">
                                <div className="mb-3 flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Children</h4>
                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                        {parent.children.length}
                                    </span>
                                </div>

                                {parent.children.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-gray-200 px-4 py-5 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                                        No students linked to this parent.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {parent.children.map((child) => (
                                            <div key={child.id} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/40">
                                                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                                    <div>
                                                        <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                                            <GraduationCap className="h-4 w-4 text-blue-600" />
                                                            {child.name}
                                                        </div>
                                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{child.email}</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 text-xs">
                                                        <span className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                                            {child.class_name || 'Unassigned class'}
                                                        </span>
                                                        <span className="rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                            Roll {child.roll_number}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{child.branch_name || 'Unassigned branch'}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {!isLoading && parents.length === 0 && (
                        <div className="col-span-full rounded-xl border-2 border-dashed border-gray-300 bg-white py-12 text-center dark:border-gray-700 dark:bg-gray-800">
                            <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Parents found</h3>
                            <p className="mt-1 text-gray-500">Create a parent profile to link students as children.</p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
