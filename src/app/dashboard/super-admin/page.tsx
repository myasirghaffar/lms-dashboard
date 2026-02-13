import React from 'react';
import { Building2, Users, GraduationCap, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

import { getDashboardStats, getBranches, getFees } from '@/lib/api';

function SuperAdminDashboardContent() {
    const dashboardStats = getDashboardStats();
    const branchesData = getBranches();
    const feesData = getFees();

    const stats = [
        { title: 'Total Branches', value: dashboardStats.totalBranches?.toString() || '0', icon: Building2, color: 'bg-blue-500' },
        { title: 'Total Students', value: dashboardStats.totalStudents?.toString() || '0', icon: GraduationCap, color: 'bg-green-500' },
        { title: 'Total Teachers', value: dashboardStats.totalTeachers?.toString() || '0', icon: Users, color: 'bg-purple-500' },
        { title: 'Revenue (Monthly)', value: `$${feesData.reduce((acc, fee) => acc + fee.paid, 0)}`, icon: DollarSign, color: 'bg-yellow-500' },
    ];

    const branches = branchesData.map(b => ({
        name: b.name,
        students: 0, // In a real app we'd filter students by branch here, for now dummy 0 or implement getStudentsByBranch
        attendance: 95 // Hardcoded for now as per "dummy data" request if not available
    }));

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Global system overview and management</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Branch Performance</h2>
                    <div className="space-y-4">
                        {branches.map((branch) => (
                            <div key={branch.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{branch.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{branch.students} Students</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                                        {branch.attendance}% Attendance
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">System Activity</h2>
                    <div className="space-y-4">
                        {[
                            { action: 'New branch created', time: '2 hours ago', type: 'success' },
                            { action: 'Admin assigned to North Branch', time: '5 hours ago', type: 'info' },
                            { action: 'System backup completed', time: '1 day ago', type: 'success' },
                            { action: 'New academic year configured', time: '2 days ago', type: 'info' },
                        ].map((activity, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 dark:text-white">{activity.action}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition text-center">
                        <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Add Branch</span>
                    </button>
                    <button className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition text-center">
                        <Users className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Assign Admin</span>
                    </button>
                    <button className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition text-center">
                        <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Academic Year</span>
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

export default function SuperAdminDashboard() {
    return (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <SuperAdminDashboardContent />
        </ProtectedRoute>
    );
}
