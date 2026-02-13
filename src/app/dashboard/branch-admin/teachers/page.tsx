'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Users, Search, Filter, Mail, Phone, MapPin, MoreHorizontal, BookOpen } from 'lucide-react';
import { getTeachers, getUsers } from '@/lib/api';

export default function TeachersPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const teachers = getTeachers();
    const users = getUsers();

    const teacherList = teachers.map(teacher => {
        const user = users.find(u => u.id === teacher.userId);

        return {
            ...teacher,
            name: user?.name || 'Unknown',
            email: user?.email || 'N/A',
            phoneNumber: user?.phoneNumber || 'N/A',
            address: user?.address || 'N/A',
            profileImage: user?.profileImage
        };
    }).filter(teacher =>
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
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Add Teacher
                    </button>
                </div>

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
                    {teacherList.map((teacher) => (
                        <div key={teacher.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={teacher.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}`}
                                        alt={teacher.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
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
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {teacher.email}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {teacher.phoneNumber}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {teacher.address}
                                </div>
                            </div>
                        </div>
                    ))}
                    {teacherList.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Teachers found</h3>
                            <p className="text-gray-500 mt-1">Create a new teacher via the 'Add Teacher' button.</p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
