'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { BookOpen, CalendarDays, Clock, MoreHorizontal, Plus, Search, User } from 'lucide-react';
import TimetableModal, { TimetableFormValues } from '@/components/dashboard/academics/TimetableModal';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { SchoolClassRecord, SubjectRecord, SystemUserRecord, TimetableEntryRecord } from '@/types/user-management';

type TimetableResponse = { entries: TimetableEntryRecord[] };
type TimetableEntryResponse = { entry: TimetableEntryRecord };
type ClassesResponse = { classes: SchoolClassRecord[] };
type SubjectsResponse = { subjects: SubjectRecord[] };
type UsersResponse = { users: SystemUserRecord[] };

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function formatTime(value: string) {
    return value?.slice(0, 5) || '--:--';
}

function sortEntries(entries: TimetableEntryRecord[]) {
    return [...entries].sort((a, b) => {
        const dayDelta = DAY_ORDER.indexOf(a.day_of_week) - DAY_ORDER.indexOf(b.day_of_week);
        if (dayDelta !== 0) return dayDelta;
        return a.start_time.localeCompare(b.start_time);
    });
}

export default function TimetablePage() {
    const [entries, setEntries] = React.useState<TimetableEntryRecord[]>([]);
    const [classes, setClasses] = React.useState<SchoolClassRecord[]>([]);
    const [subjects, setSubjects] = React.useState<SubjectRecord[]>([]);
    const [teachers, setTeachers] = React.useState<SystemUserRecord[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingEntry, setEditingEntry] = React.useState<TimetableEntryRecord | null>(null);
    const [deletingEntry, setDeletingEntry] = React.useState<TimetableEntryRecord | null>(null);
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
    const [saving, setSaving] = React.useState(false);

    const loadData = React.useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [timetablePayload, classesPayload, subjectsPayload, teachersPayload] = await Promise.all([
                requestDashboardApi<TimetableResponse>('/api/timetable'),
                requestDashboardApi<ClassesResponse>('/api/classes'),
                requestDashboardApi<SubjectsResponse>('/api/subjects'),
                requestDashboardApi<UsersResponse>('/api/users?role=TEACHER'),
            ]);
            setEntries(sortEntries(timetablePayload.entries));
            setClasses(classesPayload.classes);
            setSubjects(subjectsPayload.subjects);
            setTeachers(teachersPayload.users);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load timetable.');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredEntries = sortEntries(entries).filter((entry) => {
        const haystack = [
            entry.day_of_week,
            entry.class_name,
            entry.subject_name,
            entry.teacher_name,
            entry.branch_name,
            entry.room_number,
        ].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(searchTerm.toLowerCase());
    });

    const openCreateModal = () => {
        setEditingEntry(null);
        setIsModalOpen(true);
    };

    const openEditModal = (entry: TimetableEntryRecord) => {
        setEditingEntry(entry);
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const handleSubmit = async (values: TimetableFormValues) => {
        setSaving(true);
        try {
            const response = editingEntry
                ? await requestDashboardApi<TimetableEntryResponse>(`/api/timetable/${editingEntry.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(values),
                })
                : await requestDashboardApi<TimetableEntryResponse>('/api/timetable', {
                    method: 'POST',
                    body: JSON.stringify(values),
                });
            setEntries((current) => sortEntries(editingEntry
                ? current.map((item) => item.id === response.entry.id ? response.entry : item)
                : [response.entry, ...current]));
            setIsModalOpen(false);
            setEditingEntry(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to save timetable period.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingEntry) return;
        try {
            await requestDashboardApi<{ success: boolean }>(`/api/timetable/${deletingEntry.id}`, { method: 'DELETE' });
            setEntries((current) => current.filter((item) => item.id !== deletingEntry.id));
            setDeletingEntry(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to delete timetable period.');
        }
    };

    return (
        <ProtectedRoute allowedRoles={['BRANCH_ADMIN', 'SUPER_ADMIN']}>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Schedule class periods with subjects, teachers, rooms, and timings</p>
                    </div>
                    <button onClick={openCreateModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Period
                    </button>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                        {error}
                    </div>
                )}

                <TimetableModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingEntry(null);
                    }}
                    onSubmit={handleSubmit}
                    entry={editingEntry}
                    classes={classes}
                    subjects={subjects}
                    teachers={teachers}
                    isSubmitting={saving}
                />

                <ConfirmModal
                    isOpen={Boolean(deletingEntry)}
                    onClose={() => setDeletingEntry(null)}
                    onConfirm={handleDelete}
                    title="Delete Period"
                    message={`Delete ${deletingEntry?.subject_name || 'this period'} from the timetable?`}
                />

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search timetable by class, subject, teacher, day..."
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Day & Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teacher</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Loading timetable...</td>
                                    </tr>
                                ) : filteredEntries.length ? filteredEntries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-start gap-3">
                                                <CalendarDays className="w-4 h-4 mt-1 text-blue-500" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{entry.day_of_week}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatTime(entry.start_time)} - {formatTime(entry.end_time)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center">
                                                <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                                                {entry.class_name || 'Unassigned'}
                                            </div>
                                            {entry.room_number && <p className="mt-1 text-xs text-gray-400">{entry.room_number}</p>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                {entry.subject_name || 'Unassigned'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-2 text-gray-400" />
                                                {entry.teacher_name || 'Unassigned'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="relative inline-block">
                                                <button onClick={() => setOpenMenuId(openMenuId === entry.id ? null : entry.id)} className="dropdown-toggle text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                                <Dropdown isOpen={openMenuId === entry.id} onClose={() => setOpenMenuId(null)} className="w-36">
                                                    <DropdownItem onClick={() => openEditModal(entry)}>Edit</DropdownItem>
                                                    <DropdownItem onClick={() => {
                                                        setDeletingEntry(entry);
                                                        setOpenMenuId(null);
                                                    }} className="text-red-600 hover:text-red-700">Delete</DropdownItem>
                                                </Dropdown>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            No timetable periods found.
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
