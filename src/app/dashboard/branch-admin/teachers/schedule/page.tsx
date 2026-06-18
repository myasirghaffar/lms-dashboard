'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TimetableModal, { TimetableFormValues } from '@/components/dashboard/academics/TimetableModal';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { SchoolClassRecord, SubjectRecord, SystemUserRecord, TimetableEntryRecord } from '@/types/user-management';
import { BookOpen, CalendarDays, Clock, MoreHorizontal, Plus, Search, UserRound, UsersRound } from 'lucide-react';

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
        const teacherDelta = (a.teacher_name || '').localeCompare(b.teacher_name || '');
        if (teacherDelta !== 0) return teacherDelta;
        const dayDelta = DAY_ORDER.indexOf(a.day_of_week) - DAY_ORDER.indexOf(b.day_of_week);
        if (dayDelta !== 0) return dayDelta;
        return a.start_time.localeCompare(b.start_time);
    });
}

function getTeacherLoad(entries: TimetableEntryRecord[], teacherId: string) {
    return entries.filter((entry) => entry.teacher_profile_id === teacherId).length;
}

export default function TeacherSchedulePage() {
    const [entries, setEntries] = React.useState<TimetableEntryRecord[]>([]);
    const [classes, setClasses] = React.useState<SchoolClassRecord[]>([]);
    const [subjects, setSubjects] = React.useState<SubjectRecord[]>([]);
    const [teachers, setTeachers] = React.useState<SystemUserRecord[]>([]);
    const [selectedTeacherId, setSelectedTeacherId] = React.useState('');
    const [selectedDay, setSelectedDay] = React.useState('');
    const [selectedClassId, setSelectedClassId] = React.useState('');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingEntry, setEditingEntry] = React.useState<Partial<TimetableEntryRecord> | null>(null);
    const [deletingEntry, setDeletingEntry] = React.useState<TimetableEntryRecord | null>(null);
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

    const loadData = React.useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (selectedTeacherId) params.set('teacher_profile_id', selectedTeacherId);
            if (selectedDay) params.set('day_of_week', selectedDay);
            if (selectedClassId) params.set('class_id', selectedClassId);

            const schedulePath = `/api/teacher-schedules${params.toString() ? `?${params.toString()}` : ''}`;
            const [schedulePayload, classesPayload, subjectsPayload, teachersPayload] = await Promise.all([
                requestDashboardApi<TimetableResponse>(schedulePath),
                requestDashboardApi<ClassesResponse>('/api/classes'),
                requestDashboardApi<SubjectsResponse>('/api/subjects'),
                requestDashboardApi<UsersResponse>('/api/users?role=TEACHER'),
            ]);

            setEntries(sortEntries(schedulePayload.entries));
            setClasses(classesPayload.classes);
            setSubjects(subjectsPayload.subjects);
            setTeachers(teachersPayload.users);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load teacher schedules.');
        } finally {
            setLoading(false);
        }
    }, [selectedClassId, selectedDay, selectedTeacherId]);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredEntries = React.useMemo(() => {
        const needle = searchTerm.trim().toLowerCase();
        if (!needle) return sortEntries(entries);
        return sortEntries(entries).filter((entry) => {
            const haystack = [
                entry.teacher_name,
                entry.day_of_week,
                entry.class_name,
                entry.subject_name,
                entry.branch_name,
                entry.room_number,
                entry.start_time,
                entry.end_time,
            ].filter(Boolean).join(' ').toLowerCase();
            return haystack.includes(needle);
        });
    }, [entries, searchTerm]);

    const selectedTeacher = teachers.find((teacher) => teacher.id === selectedTeacherId);
    const activeTeachers = teachers.filter((teacher) => entries.some((entry) => entry.teacher_profile_id === teacher.id)).length;

    const openCreateModal = () => {
        setEditingEntry(selectedTeacherId ? {
            teacher_profile_id: selectedTeacherId,
            day_of_week: selectedDay || 'Monday',
            class_id: selectedClassId || null,
        } : null);
        setIsModalOpen(true);
    };

    const openEditModal = (entry: TimetableEntryRecord) => {
        setEditingEntry(entry);
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const handleSubmit = async (values: TimetableFormValues) => {
        setSaving(true);
        setError('');
        try {
            const response = editingEntry?.id
                ? await requestDashboardApi<TimetableEntryResponse>(`/api/teacher-schedules/${editingEntry.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(values),
                })
                : await requestDashboardApi<TimetableEntryResponse>('/api/teacher-schedules', {
                    method: 'POST',
                    body: JSON.stringify(values),
                });

            setEntries((current) => sortEntries(editingEntry?.id
                ? current.map((item) => item.id === response.entry.id ? response.entry : item)
                : [response.entry, ...current]));
            setIsModalOpen(false);
            setEditingEntry(null);
            await loadData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to save teacher schedule.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingEntry) return;
        setError('');
        try {
            await requestDashboardApi<{ success: boolean }>(`/api/teacher-schedules/${deletingEntry.id}`, { method: 'DELETE' });
            setEntries((current) => current.filter((item) => item.id !== deletingEntry.id));
            setDeletingEntry(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to delete teacher schedule.');
        }
    };

    return (
        <ProtectedRoute allowedRoles={['BRANCH_ADMIN', 'SUPER_ADMIN']}>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Schedule</h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">Manage weekly teacher periods by class, subject, room, and day.</p>
                    </div>
                    <button onClick={openCreateModal} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                        <Plus className="h-4 w-4" />
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
                    title="Delete Schedule Period"
                    message={`Delete ${deletingEntry?.teacher_name || 'this teacher'}'s ${deletingEntry?.subject_name || 'period'} from the schedule?`}
                />

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled Periods</span>
                            <CalendarDays className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{entries.length}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Teachers Assigned</span>
                            <UsersRound className="h-5 w-5 text-emerald-500" />
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{activeTeachers}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Selected Teacher Load</span>
                            <Clock className="h-5 w-5 text-amber-500" />
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{selectedTeacherId ? getTeacherLoad(entries, selectedTeacherId) : '-'}</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{selectedTeacher?.name || 'Choose a teacher filter'}</p>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search teacher, class, subject, room..."
                                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900/30"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>
                        <select value={selectedTeacherId} onChange={(event) => setSelectedTeacherId(event.target.value)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900/30">
                            <option value="">All teachers</option>
                            {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
                        </select>
                        <select value={selectedDay} onChange={(event) => setSelectedDay(event.target.value)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900/30">
                            <option value="">All days</option>
                            {DAY_ORDER.map((day) => <option key={day} value={day}>{day}</option>)}
                        </select>
                        <select value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900/30">
                            <option value="">All classes</option>
                            {classes.map((classRecord) => <option key={classRecord.id} value={classRecord.id}>{classRecord.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[920px]">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Teacher</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Day & Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Class</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Room</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Loading teacher schedules...</td>
                                    </tr>
                                ) : filteredEntries.length ? filteredEntries.map((entry) => (
                                    <tr key={entry.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/70">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                                                    <UserRound className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{entry.teacher_name || 'Unassigned teacher'}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{entry.branch_name || 'No branch'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 dark:text-white">{entry.day_of_week}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatTime(entry.start_time)} - {formatTime(entry.end_time)}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            <span className="inline-flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-gray-400" />
                                                {entry.class_name || 'Unassigned'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{entry.subject_name || 'Unassigned'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{entry.room_number || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative inline-block">
                                                <button onClick={() => setOpenMenuId(openMenuId === entry.id ? null : entry.id)} className="dropdown-toggle rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300" aria-label="Open schedule actions">
                                                    <MoreHorizontal className="h-5 w-5" />
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
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            No teacher schedule periods found.
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
