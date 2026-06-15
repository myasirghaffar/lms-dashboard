'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
    Building2,
    Edit3,
    MapPin,
    MoreHorizontal,
    Phone,
    Power,
    PowerOff,
    Trash2,
    Users,
} from 'lucide-react';
import { getStudents, getTeachers } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import AddBranchModal from '@/components/dashboard/branches/AddBranchModal';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import type { BranchFormValues, BranchRecord } from '@/types/branches';
import type { SystemUserRecord } from '@/types/user-management';

type DeleteState = {
    isOpen: boolean;
    branch: BranchRecord | null;
};

const studentsData = getStudents();
const teachersData = getTeachers();

async function getAccessToken() {
    const { data, error } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (error || !token) {
        throw new Error('Your session expired. Please login again.');
    }

    return token;
}

async function requestBranches<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await getAccessToken();
    const response = await fetch(path, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(init?.headers || {}),
        },
    });
    const payload = await response.json();

    if (!response.ok) {
        throw new Error(payload.error || 'Branch request failed.');
    }

    return payload as T;
}

export default function BranchesPage() {
    const [branches, setBranches] = React.useState<BranchRecord[]>([]);
    const [principals, setPrincipals] = React.useState<SystemUserRecord[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
    const [editingBranch, setEditingBranch] = React.useState<BranchRecord | null>(null);
    const [isBranchModalOpen, setIsBranchModalOpen] = React.useState(false);
    const [deleteState, setDeleteState] = React.useState<DeleteState>({
        isOpen: false,
        branch: null,
    });

    const loadBranches = React.useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const [branchesPayload, principalsPayload] = await Promise.all([
                requestBranches<{ branches: BranchRecord[] }>('/api/branches'),
                requestBranches<{ users: SystemUserRecord[] }>('/api/users?role=BRANCH_ADMIN'),
            ]);
            setBranches(branchesPayload.branches);
            setPrincipals(principalsPayload.users);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to load branches.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        void loadBranches();
    }, [loadBranches]);

    const getCounts = (branch: BranchRecord) => {
        const branchKey = branch.legacy_id || branch.id;

        return {
            students: studentsData.filter((student) => student.branchId === branchKey).length,
            teachers: teachersData.filter((teacher) => teacher.branchId === branchKey).length,
        };
    };

    const openCreateModal = () => {
        setEditingBranch(null);
        setIsBranchModalOpen(true);
    };

    const openEditModal = (branch: BranchRecord) => {
        setOpenMenuId(null);
        setEditingBranch(branch);
        setIsBranchModalOpen(true);
    };

    const closeBranchModal = () => {
        if (isSubmitting) return;
        setIsBranchModalOpen(false);
        setEditingBranch(null);
    };

    const handleSaveBranch = async (values: BranchFormValues) => {
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            if (editingBranch) {
                const payload = await requestBranches<{ branch: BranchRecord }>(`/api/branches/${editingBranch.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(values),
                });

                setBranches((current) =>
                    current.map((branch) => branch.id === payload.branch.id ? payload.branch : branch)
                );
            } else {
                const payload = await requestBranches<{ branch: BranchRecord }>('/api/branches', {
                    method: 'POST',
                    body: JSON.stringify(values),
                });

                setBranches((current) => [...current, payload.branch]);
            }

            setIsBranchModalOpen(false);
            setEditingBranch(null);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to save branch.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleStatus = async (branch: BranchRecord) => {
        setOpenMenuId(null);
        setErrorMessage('');
        const nextStatus = branch.status === 'active' ? 'disabled' : 'active';

        try {
            const payload = await requestBranches<{ branch: BranchRecord }>(`/api/branches/${branch.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: nextStatus }),
            });

            setBranches((current) =>
                current.map((item) => item.id === payload.branch.id ? payload.branch : item)
            );
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to update branch status.');
        }
    };

    const handleDeleteBranch = async () => {
        if (!deleteState.branch) return;
        setErrorMessage('');

        try {
            await requestBranches<{ success: boolean }>(`/api/branches/${deleteState.branch.id}`, {
                method: 'DELETE',
            });
            setBranches((current) => current.filter((branch) => branch.id !== deleteState.branch?.id));
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to delete branch.');
        } finally {
            setDeleteState({ isOpen: false, branch: null });
        }
    };

    return (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <div className="space-y-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Branches Management</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage all school branches and campuses</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-theme-sm transition hover:bg-blue-700"
                    >
                        <Building2 className="h-5 w-5" />
                        Add Branch
                    </button>
                </div>

                {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                        {errorMessage}
                    </div>
                )}

                <AddBranchModal
                    isOpen={isBranchModalOpen}
                    onClose={closeBranchModal}
                    onSubmit={handleSaveBranch}
                    branch={editingBranch}
                    isSubmitting={isSubmitting}
                    principals={principals}
                />

                <ConfirmModal
                    isOpen={deleteState.isOpen}
                    onClose={() => setDeleteState({ isOpen: false, branch: null })}
                    onConfirm={handleDeleteBranch}
                    title="Delete Branch"
                    message={`Are you sure you want to delete ${deleteState.branch?.name || 'this branch'}? This action cannot be undone.`}
                    confirmText="Delete"
                    variant="danger"
                />

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="h-80 animate-pulse rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800" />
                        ))}
                    </div>
                ) : branches.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
                        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                        <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No branches yet</h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Create your first branch to start managing campuses.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {branches.map((branch) => {
                            const counts = getCounts(branch);
                            const isDisabled = branch.status === 'disabled';

                            return (
                                <div
                                    key={branch.id}
                                    className={`relative rounded-2xl border bg-white p-6 shadow-theme-sm transition hover:-translate-y-1 hover:shadow-theme-lg dark:bg-gray-800 ${isDisabled ? 'border-gray-200 opacity-75 dark:border-gray-700' : 'border-gray-100 dark:border-gray-700'
                                        }`}
                                >
                                    <div className="mb-7 flex items-start justify-between">
                                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${isDisabled ? 'bg-gray-100 text-gray-500 dark:bg-gray-700' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                            }`}>
                                            <Building2 className="h-7 w-7" />
                                        </div>

                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId((current) => current === branch.id ? null : branch.id)}
                                                className="dropdown-toggle rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                                                aria-label={`Open ${branch.name} actions`}
                                            >
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                            <Dropdown
                                                isOpen={openMenuId === branch.id}
                                                onClose={() => setOpenMenuId(null)}
                                                className="w-48"
                                            >
                                                <DropdownItem onClick={() => openEditModal(branch)} className="flex items-center gap-2">
                                                    <Edit3 className="h-4 w-4" />
                                                    Edit Branch
                                                </DropdownItem>
                                                <DropdownItem onClick={() => handleToggleStatus(branch)} className="flex items-center gap-2">
                                                    {isDisabled ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                                                    {isDisabled ? 'Enable Branch' : 'Disable Branch'}
                                                </DropdownItem>
                                                <DropdownItem
                                                    onClick={() => {
                                                        setOpenMenuId(null);
                                                        setDeleteState({ isOpen: true, branch });
                                                    }}
                                                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete Branch
                                                </DropdownItem>
                                            </Dropdown>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="mb-3 flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{branch.name}</h3>
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isDisabled ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                                }`}>
                                                {isDisabled ? 'Disabled' : 'Active'}
                                            </span>
                                        </div>

                                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-4 w-4 shrink-0" />
                                                <span>{branch.address}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-4 w-4 shrink-0" />
                                                <span>{branch.phone_number}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Users className="h-4 w-4 shrink-0" />
                                                <span>{branch.principal_name || 'Principal not assigned'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 dark:border-gray-700">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Students</p>
                                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{counts.students}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Teachers</p>
                                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{counts.teachers}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
