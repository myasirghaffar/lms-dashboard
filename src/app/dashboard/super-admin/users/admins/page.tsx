'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Users, Mail, Phone, MapPin, MoreHorizontal, Shield } from 'lucide-react';
import { getUsers } from '@/lib/api';

export default function AdminsPage() {
    const allUsers = getUsers();
    const admins = allUsers.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN');

    return (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Management</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage system administrators and branch admins</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Add Admin
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {admins.map((admin) => (
                        <div key={admin.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={admin.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name || 'Admin')}`}
                                        alt={admin.name || 'Admin'}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{admin.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full w-fit mt-1">
                                            <Shield className="w-3 h-3" />
                                            {admin.role.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {admin.email}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {admin.phoneNumber || 'N/A'}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {admin.address || 'N/A'}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Joined</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {new Date(admin.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {admins.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Admins found</h3>
                            <p className="text-gray-500 mt-1">Get started by adding a new administrator.</p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
