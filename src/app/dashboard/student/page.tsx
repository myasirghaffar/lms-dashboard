import React from 'react';
import { BookOpen, ClipboardCheck, FileText, Calendar, Award, TrendingUp, Bell } from 'lucide-react';

export default function StudentDashboard() {
    const stats = [
        { title: 'Attendance', value: '92%', icon: ClipboardCheck, color: 'bg-green-500' },
        { title: 'Average Score', value: '85%', icon: Award, color: 'bg-blue-500' },
        { title: 'Pending Assignments', value: '3', icon: FileText, color: 'bg-yellow-500' },
        { title: 'Upcoming Exams', value: '2', icon: Calendar, color: 'bg-purple-500' },
    ];

    const recentGrades = [
        { subject: 'Mathematics', exam: 'Mid-term', score: 88, grade: 'A', maxScore: 100 },
        { subject: 'Science', exam: 'Quiz 3', score: 92, grade: 'A+', maxScore: 100 },
        { subject: 'English', exam: 'Essay', score: 78, grade: 'B', maxScore: 100 },
        { subject: 'History', exam: 'Test 2', score: 85, grade: 'A', maxScore: 100 },
    ];

    const assignments = [
        { title: 'Math Assignment - Chapter 5', subject: 'Mathematics', dueDate: 'Feb 15, 2026', status: 'pending' },
        { title: 'Science Project Report', subject: 'Science', dueDate: 'Feb 18, 2026', status: 'pending' },
        { title: 'English Essay', subject: 'English', dueDate: 'Feb 20, 2026', status: 'pending' },
    ];

    const announcements = [
        { title: 'Parent-Teacher Meeting', date: 'Feb 15, 2026', type: 'event' },
        { title: 'Mid-term Exam Schedule Released', date: 'Feb 10, 2026', type: 'academic' },
        { title: 'Sports Day Registration Open', date: 'Feb 8, 2026', type: 'event' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, Sarah!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Grades */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Grades</h2>
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        {recentGrades.map((grade, index) => (
                            <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:shadow-md transition">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{grade.subject}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{grade.exam}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{grade.score}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">/ {grade.maxScore}</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-lg ${grade.grade.startsWith('A') ? 'bg-green-500' :
                                                    grade.grade.startsWith('B') ? 'bg-blue-500' : 'bg-yellow-500'
                                                }`}>
                                                <p className="text-white font-bold">{grade.grade}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Announcements */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Announcements</h2>
                        <Bell className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        {announcements.map((announcement, index) => (
                            <div key={index} className={`p-3 rounded-lg ${announcement.type === 'event' ? 'bg-purple-50 dark:bg-purple-900/20' :
                                    'bg-blue-50 dark:bg-blue-900/20'
                                }`}>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{announcement.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{announcement.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pending Assignments */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pending Assignments</h2>
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {assignments.map((assignment, index) => (
                        <div key={index} className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-3">
                                <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                <span className="text-xs px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded">
                                    Pending
                                </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{assignment.title}</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{assignment.subject}</p>
                            <p className="text-xs text-red-600 dark:text-red-400 font-semibold">Due: {assignment.dueDate}</p>
                            <button className="mt-3 w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition">
                                Submit Assignment
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Subject-wise Performance</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Mathematics', 'Science', 'English', 'History'].map((subject, index) => (
                        <div key={subject} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg text-center">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{subject}</p>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                                {82 + index * 3}%
                            </p>
                            <div className="mt-2 flex items-center justify-center space-x-1">
                                <TrendingUp className="h-3 w-3 text-green-600" />
                                <span className="text-xs text-green-600 dark:text-green-400">+{2 + index}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition text-center">
                        <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Study Materials</span>
                    </button>
                    <button className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition text-center">
                        <ClipboardCheck className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Attendance</span>
                    </button>
                    <button className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition text-center">
                        <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Timetable</span>
                    </button>
                    <button className="p-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-lg transition text-center">
                        <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">View Report Card</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
