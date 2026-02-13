'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { BookOpen, Users, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getClasses, getTeachers, getStudents } from '@/lib/api';

export default function MyClassesPage() {
    const { user } = useAuth();

    const teachers = getTeachers();
    const classes = getClasses();
    const students = getStudents();

    // Find current teacher profile
    const currentTeacher = teachers.find(t => t.userId === user?.id);

    // Filter classes for this teacher
    const myClasses = currentTeacher
        ? classes.filter(c => c.teacherId === currentTeacher.id)
        : [];

    const classList = myClasses.map(cls => ({
        ...cls,
        studentCount: students.filter(s => s.classId === cls.id).length
    }));

    return (
        <ProtectedRoute allowedRoles={['TEACHER']}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Classes</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your assigned classes and students</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classList.map((cls) => (
                        <div key={cls.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cls.name}</h3>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Users className="w-4 h-4 mr-2" />
                                    {cls.studentCount} Students
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Active Session
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                                    View Class
                                </button>
                            </div>
                        </div>
                    ))}

                    {classList.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700">
                            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Assigned Classes</h3>
                            <p className="text-gray-500 mt-1">You are not assigned to any classes yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
