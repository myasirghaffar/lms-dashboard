'use client';

import React from 'react';
import { Users, GraduationCap, Heart, Bell, TrendingUp, Calendar } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getStudents, getAttendance, getMarks, getUsers, getClasses } from '@/lib/api';

function ParentDashboardContent() {
    const { user } = useAuth();

    // Data Loading
    const allStudents = getStudents();
    const allAttendance = getAttendance();
    const allMarks = getMarks();
    const allUsers = getUsers();
    const allClasses = getClasses();

    // Derive children data
    const children = allStudents
        .filter(s => s.parentId === user?.id)
        .map(child => {
            const childUser = allUsers.find(u => u.id === child.userId);
            const att = allAttendance.filter(a => a.studentId === child.id);
            const marks = allMarks.filter(m => m.studentId === child.id);
            const cls = allClasses.find(c => c.id === child.classId);

            // Calculate stats
            const attendancePct = att.length > 0
                ? Math.round((att.filter(a => a.status === 'PRESENT').length / att.length) * 100)
                : 95; // Default dummy value if no records

            const avgScore = marks.length > 0
                ? Math.round(marks.reduce((acc, m) => acc + m.score, 0) / marks.length)
                : 85; // Default dummy value

            return {
                id: child.id,
                name: childUser?.name || 'Unknown Child',
                class: cls?.name || 'Grade 10-A',
                rollNumber: child.rollNumber,
                attendance: attendancePct,
                avgScore: avgScore,
                upcomingExams: 2,
            };
        });

    const recentUpdates = [
        { title: 'Mid-term exam results published', date: 'Today', type: 'academic' },
        { title: 'Parent-Teacher meeting scheduled', date: 'Feb 15, 2026', type: 'event' },
        { title: 'Fee payment reminder', date: 'Feb 20, 2026', type: 'fee' },
        { title: 'Sports Day registration open', date: 'Feb 25, 2026', type: 'event' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parent Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor your child&apos;s academic progress</p>
            </div>

            {/* Children Overview */}
            {children.length > 0 ? (
                children.map((child) => (
                    <div key={child.id} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{child.name}</h2>
                                <p className="text-gray-600 dark:text-gray-400">{child.class} • Roll No: {child.rollNumber}</p>
                            </div>
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                <GraduationCap className="h-8 w-8 text-white" />
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{child.attendance}%</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{child.avgScore}%</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Exams</p>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{child.upcomingExams}</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <p className="text-yellow-800 dark:text-yellow-200 text-center">
                        No children linked to your account. Please contact administration.
                        <br />
                        <span className="text-sm opacity-75">(Try logging in as parent1@example.com for values)</span>
                    </p>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Updates */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Updates</h2>
                        <Bell className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {recentUpdates.map((update, index) => (
                            <div key={index} className={`p-3 rounded-lg ${update.type === 'academic' ? 'bg-blue-50 dark:bg-blue-900/20' :
                                update.type === 'event' ? 'bg-purple-50 dark:bg-purple-900/20' :
                                    'bg-yellow-50 dark:bg-yellow-900/20'
                                }`}>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{update.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{update.date}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Communication */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition text-left flex items-center space-x-3">
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">Contact Teacher</span>
                        </button>
                        <button className="w-full p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition text-left flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">View Timetable</span>
                        </button>
                        <button className="w-full p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition text-left flex items-center space-x-3">
                            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">View Report Card</span>
                        </button>
                        <button className="w-full p-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-lg transition text-left flex items-center space-x-3">
                            <Heart className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">View Fee Status</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Grades */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Grades</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { subject: 'Mathematics', score: 88, grade: 'A' },
                        { subject: 'Science', score: 92, grade: 'A+' },
                        { subject: 'English', score: 85, grade: 'A' },
                        { subject: 'History', score: 90, grade: 'A+' },
                    ].map((item, index) => (
                        <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg text-center">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{item.subject}</p>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{item.score}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Grade: {item.grade}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ParentDashboard() {
    return (
        <ProtectedRoute allowedRoles={['PARENT']}>
            <ParentDashboardContent />
        </ProtectedRoute>
    );
}
