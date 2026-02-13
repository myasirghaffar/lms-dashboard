import React from 'react';
import { BookOpen, ClipboardCheck, FileText, Users, Calendar, TrendingUp } from 'lucide-react';

export default function TeacherDashboard() {
    const stats = [
        { title: 'My Classes', value: '5', icon: BookOpen, color: 'bg-blue-500' },
        { title: 'Total Students', value: '156', icon: Users, color: 'bg-green-500' },
        { title: 'Pending Assignments', value: '12', icon: FileText, color: 'bg-yellow-500' },
        { title: 'Attendance Today', value: '92%', icon: ClipboardCheck, color: 'bg-purple-500' },
    ];

    const myClasses = [
        { name: 'Grade 10 - Section A', subject: 'Mathematics', students: 32, nextClass: 'Today, 10:00 AM' },
        { name: 'Grade 10 - Section B', subject: 'Mathematics', students: 30, nextClass: 'Today, 2:00 PM' },
        { name: 'Grade 9 - Section A', subject: 'Mathematics', students: 28, nextClass: 'Tomorrow, 9:00 AM' },
        { name: 'Grade 9 - Section B', subject: 'Mathematics', students: 31, nextClass: 'Tomorrow, 11:00 AM' },
        { name: 'Grade 8 - Section A', subject: 'Mathematics', students: 35, nextClass: 'Tomorrow, 3:00 PM' },
    ];

    const pendingTasks = [
        { task: 'Grade assignments for Grade 10-A', priority: 'high', dueDate: 'Today' },
        { task: 'Prepare quiz for Grade 9-B', priority: 'medium', dueDate: 'Tomorrow' },
        { task: 'Update lesson plan for next week', priority: 'low', dueDate: 'Feb 18' },
        { task: 'Submit attendance report', priority: 'high', dueDate: 'Today' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teacher Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, Mr. Johnson!</p>
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
                {/* My Classes */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Classes</h2>
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        {myClasses.map((classItem, index) => (
                            <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:shadow-md transition">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{classItem.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{classItem.subject} • {classItem.students} Students</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Next Class</p>
                                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{classItem.nextClass}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Tasks */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pending Tasks</h2>
                        <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        {pendingTasks.map((item, index) => (
                            <div key={index} className={`p-3 rounded-lg ${item.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20' :
                                    item.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                                        'bg-green-50 dark:bg-green-900/20'
                                }`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.task}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Due: {item.dueDate}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${item.priority === 'high' ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' :
                                            item.priority === 'medium' ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200' :
                                                'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                                        }`}>
                                        {item.priority}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Class Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Class Performance Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {myClasses.map((classItem, index) => (
                        <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-lg text-center">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{classItem.name}</p>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                                {78 + index * 3}%
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Avg. Score</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition text-center">
                        <ClipboardCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Take Attendance</span>
                    </button>
                    <button className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition text-center">
                        <FileText className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Create Assignment</span>
                    </button>
                    <button className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition text-center">
                        <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Add Marks</span>
                    </button>
                    <button className="p-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-lg transition text-center">
                        <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">View Analytics</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
