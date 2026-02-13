import React from 'react';
import { Users, GraduationCap, ClipboardCheck, DollarSign, Calendar, Bell, TrendingUp } from 'lucide-react';

export default function BranchAdminDashboard() {
    const stats = [
        { title: 'Total Students', value: '1,245', icon: GraduationCap, color: 'bg-blue-500', change: '+12%' },
        { title: 'Total Teachers', value: '78', icon: Users, color: 'bg-green-500', change: '+5%' },
        { title: 'Attendance Today', value: '94.5%', icon: ClipboardCheck, color: 'bg-purple-500', change: '+2.3%' },
        { title: 'Pending Fees', value: '$45,200', icon: DollarSign, color: 'bg-yellow-500', change: '-8%' },
    ];

    const recentActivities = [
        { title: 'New student admission approved', time: '30 minutes ago', type: 'success' },
        { title: 'Teacher leave request pending', time: '1 hour ago', type: 'warning' },
        { title: 'Exam schedule published', time: '2 hours ago', type: 'info' },
        { title: 'Fee reminder sent to 45 parents', time: '3 hours ago', type: 'info' },
    ];

    const upcomingEvents = [
        { title: 'Parent-Teacher Meeting', date: 'Feb 15, 2026', time: '10:00 AM' },
        { title: 'Mid-term Examinations', date: 'Feb 20-25, 2026', time: 'All Day' },
        { title: 'Sports Day', date: 'Feb 28, 2026', time: '9:00 AM' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Branch Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Main Campus - Overview & Management</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activities</h2>
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'success' ? 'bg-green-500' :
                                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
                        <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {upcomingEvents.map((event, index) => (
                            <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="font-semibold text-gray-900 dark:text-white text-sm">{event.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{event.date}</p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{event.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Class Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Class Performance Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].map((grade, index) => (
                        <div key={grade} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg text-center">
                            <p className="font-semibold text-gray-900 dark:text-white">{grade}</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                                {85 + index * 2}%
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
                        <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Add Student</span>
                    </button>
                    <button className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition text-center">
                        <Users className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Add Teacher</span>
                    </button>
                    <button className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition text-center">
                        <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Send Notice</span>
                    </button>
                    <button className="p-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-lg transition text-center">
                        <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">View Reports</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
