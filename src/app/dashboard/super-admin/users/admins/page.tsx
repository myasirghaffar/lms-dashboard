'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Edit3, Mail, MapPin, MoreHorizontal, Phone, Shield, Trash2, Users } from 'lucide-react';
import UserModal from '@/components/dashboard/users/UserModal';
import Image from 'next/image';
import { requestDashboardApi } from '@/lib/dashboardApi';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';
import type { SystemUserRecord } from '@/types/user-management';
import type { UserFormValues } from '@/components/dashboard/users/UserModal';

export default function AdminsPage() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [admins, setAdmins] = React.useState<SystemUserRecord[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
    const [editingAdmin, setEditingAdmin] = React.useState<SystemUserRecord | null>(null);
    const [deletingAdmin, setDeletingAdmin] = React.useState<SystemUserRecord | null>(null);

    const loadAdmins = React.useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const payload = await requestDashboardApi<{ users: SystemUserRecord[] }>('/api/users?role=ADMIN,SUPER_ADMIN');
            setAdmins(payload.users);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to load admins.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        void loadAdmins();
    }, [loadAdmins]);

    const openCreateModal = () => {
        setEditingAdmin(null);
        setIsModalOpen(true);
    };

    const openEditModal = (admin: SystemUserRecord) => {
        setOpenMenuId(null);
        setEditingAdmin(admin);
        setIsModalOpen(true);
    };

    const handleSaveAdmin = async (values: UserFormValues) => {
        setIsSubmitting(true);
        setErrorMessage('');
        try {
            if (editingAdmin) {
                await requestDashboardApi<{ user: SystemUserRecord }>(`/api/users/${editingAdmin.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(values),
                });
            } else {
                await requestDashboardApi<{ user: SystemUserRecord }>('/api/users', {
                    method: 'POST',
                    body: JSON.stringify(values),
                });
            }
            setIsModalOpen(false);
            setEditingAdmin(null);
            await loadAdmins();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to save admin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAdmin = async () => {
        if (!deletingAdmin) return;
        setErrorMessage('');
        try {
            await requestDashboardApi<{ success: boolean }>(`/api/users/${deletingAdmin.id}`, { method: 'DELETE' });
            setAdmins((current) => current.filter((admin) => admin.id !== deletingAdmin.id));
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to delete admin.');
        } finally {
            setDeletingAdmin(null);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Management</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage system administrators and branch admins</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Users className="w-4 h-4" />
                        Add Admin
                    </button>
                </div>

                <UserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    roleType="ADMIN"
                    mode={editingAdmin ? 'edit' : 'add'}
                    initialData={editingAdmin}
                    onSubmit={handleSaveAdmin}
                    isSubmitting={isSubmitting}
                />

                <ConfirmModal
                    isOpen={Boolean(deletingAdmin)}
                    onClose={() => setDeletingAdmin(null)}
                    onConfirm={handleDeleteAdmin}
                    title="Delete Admin"
                    message={`Are you sure you want to delete ${deletingAdmin?.name || 'this admin'}?`}
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

                    {!isLoading && admins.map((admin) => (
                        <div key={admin.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="relative w-12 h-12">
                                        <Image
                                            src={admin.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name || 'Admin')}`}
                                            alt={admin.name || 'Admin'}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{admin.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full w-fit mt-1">
                                            <Shield className="w-3 h-3" />
                                            {admin.role.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenMenuId((current) => current === admin.id ? null : admin.id)}
                                        className="dropdown-toggle text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        aria-label={`Open ${admin.name} actions`}
                                    >
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                    <Dropdown isOpen={openMenuId === admin.id} onClose={() => setOpenMenuId(null)} className="w-44">
                                        <DropdownItem onClick={() => openEditModal(admin)} className="flex items-center gap-2">
                                            <Edit3 className="h-4 w-4" />
                                            Edit Admin
                                        </DropdownItem>
                                        <DropdownItem
                                            onClick={() => {
                                                setOpenMenuId(null);
                                                setDeletingAdmin(admin);
                                            }}
                                            className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete Admin
                                        </DropdownItem>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {admin.email}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {admin.phone_number || 'N/A'}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {admin.address || 'N/A'}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Joined</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {new Date(admin.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {!isLoading && admins.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Admins found</h3>
                            <p className="text-gray-500 mt-1">Get started by adding a new administrator.</p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
