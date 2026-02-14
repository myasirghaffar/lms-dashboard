'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Users, Search, Filter, BookOpen, Clock, MoreHorizontal } from 'lucide-react';
import { getClasses, getTeachers, getStudents, getUsers } from '@/lib/api';
import ClassModal from '@/components/dashboard/academics/ClassModal';

export default function ClassesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Data Loading
    const classes = getClasses();
    const teachers = getTeachers();
    const students = getStudents();
    const users = getUsers();

    // Map relationships
    const classList = classes.map(cls => {
        const teacher = teachers.find(t => t.id === cls.teacherId);
        const teacherUser = teacher ? users.find(u => u.id === teacher.userId) : null;
        const studentCount = students.filter(s => s.classId === cls.id).length;

        return {
            ...cls,
            teacherName: teacherUser?.name || 'Unassigned',
            studentCount
        };
    }).filter(cls =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute allowedRoles={['BRANCH_ADMIN', 'SUPER_ADMIN']}>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Classes</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage academic classes and sections</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <BookOpen className="w-4 h-4" />
                        Add Class
                    </button>
                </div>

                <ClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search classes..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classList.map((cls) => (
                        <div key={cls.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cls.name}</h3>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Users className="w-4 h-4 mr-2" />
                                    {cls.teacherName} (Class Teacher)
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {cls.studentCount} Students Enrolled
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                    {classList.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700">
                            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Classes found</h3>
                            <p className="text-gray-500 mt-1">Create a new class to get started.</p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
