'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileImageUpload from '@/components/dashboard/users/ProfileImageUpload';
import { Modal } from '@/components/ui/modal';
import { useAuth } from '@/context/AuthContext';
import { requestDashboardApi } from '@/lib/dashboardApi';
import { getProfileImageSrc } from '@/lib/profileImage';
import type { SystemUserRole } from '@/types/user-management';
import { Calendar, Camera, LogOut, Mail, MapPin, Pencil, Phone, Shield, UserRound } from 'lucide-react';

interface ProfileRecord {
    id: string;
    auth_user_id: string | null;
    email: string;
    name: string;
    role: SystemUserRole;
    phone_number: string | null;
    address: string | null;
    profile_image: string | null;
    branch_id: string | null;
    branch_name?: string | null;
    created_at: string;
    updated_at: string;
}

type ProfileResponse = { profile: ProfileRecord };

interface ProfileFormState {
    name: string;
    phone_number: string;
    address: string;
    profile_image: string;
}

function roleLabel(role?: string) {
    return role ? role.replaceAll('_', ' ') : 'User';
}

function formatDate(value?: string) {
    if (!value) return '-';
    return new Intl.DateTimeFormat('en', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}

function DetailItem({
    icon,
    label,
    value,
    tone,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    tone: string;
}) {
    return (
        <div className="flex min-w-0 items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-4 dark:border-gray-800 dark:bg-gray-900/60">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${tone}`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
                <div className="mt-1 break-words text-base font-semibold text-gray-900 dark:text-white">{value}</div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const { logout, updateUser } = useAuth();
    const [profile, setProfile] = React.useState<ProfileRecord | null>(null);
    const [formData, setFormData] = React.useState<ProfileFormState>({
        name: '',
        phone_number: '',
        address: '',
        profile_image: '',
    });
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    const loadProfile = React.useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const payload = await requestDashboardApi<ProfileResponse>('/api/profile');
            setProfile(payload.profile);
            setFormData({
                name: payload.profile.name || '',
                phone_number: payload.profile.phone_number || '',
                address: payload.profile.address || '',
                profile_image: payload.profile.profile_image || '',
            });
            updateUser({ name: payload.profile.name, email: payload.profile.email });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load profile.');
        } finally {
            setLoading(false);
        }
    }, [updateUser]);

    React.useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleChange = (field: keyof ProfileFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((current) => ({ ...current, [field]: event.target.value }));
    };

    const openEditModal = () => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                phone_number: profile.phone_number || '',
                address: profile.address || '',
                profile_image: profile.profile_image || '',
            });
        }
        setError('');
        setSuccess('');
        setIsEditing(true);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const payload = await requestDashboardApi<ProfileResponse>('/api/profile', {
                method: 'PATCH',
                body: JSON.stringify(formData),
            });
            setProfile(payload.profile);
            setFormData({
                name: payload.profile.name || '',
                phone_number: payload.profile.phone_number || '',
                address: payload.profile.address || '',
                profile_image: payload.profile.profile_image || '',
            });
            updateUser({ name: payload.profile.name, email: payload.profile.email });
            setIsEditing(false);
            setSuccess('Profile updated successfully.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <ProtectedRoute>
            <div className="w-full space-y-6">
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
                        {success}
                    </div>
                )}

                {loading ? (
                    <div className="flex h-72 items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
                    </div>
                ) : profile ? (
                    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="h-40 bg-[linear-gradient(110deg,#2563eb_0%,#4f46e5_52%,#a21caf_100%)]" />

                        <div className="px-5 pb-6 sm:px-8 lg:px-10">
                            <div className="flex flex-col gap-5 border-b border-gray-100 pb-8 dark:border-gray-800 lg:flex-row lg:items-end lg:justify-between">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                    <div className="relative -mt-16 h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg dark:border-gray-900 dark:bg-gray-800">
                                        <Image
                                            src={getProfileImageSrc(profile.profile_image, profile.name, 'User')}
                                            alt={profile.name}
                                            fill
                                            className="object-cover"
                                            sizes="128px"
                                        />
                                    </div>
                                    <div className="min-w-0 pb-1">
                                        <h1 className="break-words text-3xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold uppercase text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                <Shield className="h-4 w-4" />
                                                {roleLabel(profile.role)}
                                            </span>
                                            {profile.branch_name && (
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                                    {profile.branch_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={openEditModal} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                                    <Pencil className="h-4 w-4" />
                                    Edit Profile
                                </button>
                            </div>

                            <div className="grid gap-8 py-8 xl:grid-cols-2">
                                <section>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Contact Information</h2>
                                    <div className="mt-4 grid gap-4">
                                        <DetailItem
                                            icon={<Mail className="h-5 w-5 text-blue-600 dark:text-blue-300" />}
                                            label="Email Address"
                                            value={profile.email}
                                            tone="bg-blue-50 dark:bg-blue-900/30"
                                        />
                                        <DetailItem
                                            icon={<Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />}
                                            label="Phone Number"
                                            value={profile.phone_number || 'Not added'}
                                            tone="bg-emerald-50 dark:bg-emerald-900/30"
                                        />
                                        <DetailItem
                                            icon={<MapPin className="h-5 w-5 text-purple-600 dark:text-purple-300" />}
                                            label="Address"
                                            value={profile.address || 'Not added'}
                                            tone="bg-purple-50 dark:bg-purple-900/30"
                                        />
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">System Information</h2>
                                    <div className="mt-4 grid gap-4">
                                        <DetailItem
                                            icon={<Calendar className="h-5 w-5 text-amber-600 dark:text-amber-300" />}
                                            label="Joined Date"
                                            value={formatDate(profile.created_at)}
                                            tone="bg-amber-50 dark:bg-amber-900/30"
                                        />
                                        <DetailItem
                                            icon={<Shield className="h-5 w-5 text-red-600 dark:text-red-300" />}
                                            label="Account Status"
                                            value={<span className="inline-flex items-center gap-2 text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500" />Active</span>}
                                            tone="bg-red-50 dark:bg-red-900/30"
                                        />
                                        <DetailItem
                                            icon={<UserRound className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
                                            label="Profile ID"
                                            value={profile.id}
                                            tone="bg-gray-100 dark:bg-gray-800"
                                        />
                                    </div>
                                </section>
                            </div>

                            <div className="border-t border-gray-100 pt-6 dark:border-gray-800 lg:hidden">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}

                <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your visible profile details.</p>
                        </div>

                        <div className="space-y-5">
                            <ProfileImageUpload
                                value={formData.profile_image}
                                onChange={(url) => setFormData((current) => ({ ...current, profile_image: url }))}
                                disabled={saving}
                                label="Profile Photo"
                            />

                            <div>
                                <label htmlFor="profileName" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Full Name</label>
                                <input
                                    id="profileName"
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    required
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-blue-900/30"
                                />
                            </div>

                            <div>
                                <label htmlFor="profileEmail" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email Address</label>
                                <input
                                    id="profileEmail"
                                    value={profile?.email || ''}
                                    disabled
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                />
                            </div>

                            <div>
                                <label htmlFor="profilePhone" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Phone Number</label>
                                <input
                                    id="profilePhone"
                                    value={formData.phone_number}
                                    onChange={handleChange('phone_number')}
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-blue-900/30"
                                />
                            </div>

                            <div>
                                <label htmlFor="profileAddress" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Address</label>
                                <textarea
                                    id="profileAddress"
                                    value={formData.address}
                                    onChange={handleChange('address')}
                                    rows={4}
                                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-blue-900/30"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                            <button type="button" onClick={() => setIsEditing(false)} disabled={saving} className="rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-60 dark:text-gray-300 dark:hover:bg-gray-800">
                                Cancel
                            </button>
                            <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
                                {saving ? <Camera className="h-4 w-4 animate-pulse" /> : <Pencil className="h-4 w-4" />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </ProtectedRoute>
    );
}
