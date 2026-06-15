'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Briefcase, Edit3, Mail, MapPin, MoreHorizontal, Phone, Trash2, Users } from 'lucide-react';
import UserModal from '@/components/dashboard/users/UserModal';
import Image from 'next/image';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { SystemUserRecord } from '@/types/user-management';
import type { UserFormValues } from '@/components/dashboard/users/UserModal';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';

export default function PrincipalsPage() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [principals, setPrincipals] = React.useState<SystemUserRecord[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
    const [editingPrincipal, setEditingPrincipal] = React.useState<SystemUserRecord | null>(null);
    const [deletingPrincipal, setDeletingPrincipal] = React.useState<SystemUserRecord | null>(null);

    const loadPrincipals = React.useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const payload = await requestDashboardApi<{ users: SystemUserRecord[] }>('/api/users?role=BRANCH_ADMIN');
            setPrincipals(payload.users);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to load principals.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        void loadPrincipals();
    }, [loadPrincipals]);

    const openCreateModal = () => {
        setEditingPrincipal(null);
        setIsModalOpen(true);
    };

    const openEditModal = (principal: SystemUserRecord) => {
        setOpenMenuId(null);
        setEditingPrincipal(principal);
        setIsModalOpen(true);
    };

    const handleSavePrincipal = async (values: UserFormValues) => {
        setIsSubmitting(true);
        setErrorMessage('');
        const payload = { ...values, role: 'BRANCH_ADMIN' };

        try {
            if (editingPrincipal) {
                await requestDashboardApi<{ user: SystemUserRecord }>(`/api/users/${editingPrincipal.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(payload),
                });
            } else {
                await requestDashboardApi<{ user: SystemUserRecord }>('/api/users', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
            }

            setIsModalOpen(false);
            setEditingPrincipal(null);
            await loadPrincipals();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to save principal.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePrincipal = async () => {
        if (!deletingPrincipal) return;
        setErrorMessage('');

        try {
            await requestDashboardApi<{ success: boolean }>(`/api/users/${deletingPrincipal.id}`, { method: 'DELETE' });
            setPrincipals((current) => current.filter((principal) => principal.id !== deletingPrincipal.id));
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to delete principal.');
        } finally {
            setDeletingPrincipal(null);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Principals Management</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage school principals and branch administrators</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Users className="w-4 h-4" />
                        Add Principal
                    </button>
                </div>

                <UserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    roleType="PRINCIPAL"
                    mode={editingPrincipal ? 'edit' : 'add'}
                    initialData={editingPrincipal}
                    onSubmit={handleSavePrincipal}
                    isSubmitting={isSubmitting}
                />

                <ConfirmModal
                    isOpen={Boolean(deletingPrincipal)}
                    onClose={() => setDeletingPrincipal(null)}
                    onConfirm={handleDeletePrincipal}
                    title="Delete Principal"
                    message={`Are you sure you want to delete ${deletingPrincipal?.name || 'this principal'}? Branches linked to this principal will become unassigned.`}
                    confirmText="Delete"
                    variant="danger"
                />

                {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                        {errorMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading && [1, 2, 3].map((item) => (
                        <div key={item} className="h-72 animate-pulse rounded-xl bg-white shadow-md dark:bg-gray-800" />
                    ))}

                    {!isLoading && principals.map((principal) => (
                        <div key={principal.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="relative w-12 h-12">
                                        <Image
                                            src={principal.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(principal.name || 'Principal')}`}
                                            alt={principal.name || 'Principal'}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{principal.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full w-fit mt-1">
                                            <Briefcase className="w-3 h-3" />
                                            Principal
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenMenuId((current) => current === principal.id ? null : principal.id)}
                                        className="dropdown-toggle text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        aria-label={`Open ${principal.name} actions`}
                                    >
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                    <Dropdown isOpen={openMenuId === principal.id} onClose={() => setOpenMenuId(null)} className="w-48">
                                        <DropdownItem onClick={() => openEditModal(principal)} className="flex items-center gap-2">
                                            <Edit3 className="h-4 w-4" />
                                            Edit Principal
                                        </DropdownItem>
                                        <DropdownItem
                                            onClick={() => {
                                                setOpenMenuId(null);
                                                setDeletingPrincipal(principal);
                                            }}
                                            className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete Principal
                                        </DropdownItem>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {principal.email}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {principal.phone_number || 'N/A'}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {principal.branch_name || principal.address || 'N/A'}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Joined</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {new Date(principal.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {!isLoading && principals.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Principals found</h3>
                            <p className="text-gray-500 mt-1">Get started by adding a new principal.</p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
