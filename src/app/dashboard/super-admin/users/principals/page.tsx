'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Users, Mail, Phone, MapPin, MoreHorizontal, Briefcase } from 'lucide-react';
import { getUsers } from '@/lib/api';

export default function PrincipalsPage() {
    const allUsers = getUsers();
    const principals = allUsers.filter(u => u.role === 'BRANCH_ADMIN');

    return (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Principals Management</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage school principals and branch administrators</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Add Principal
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {principals.map((principal) => (
                        <div key={principal.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={principal.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(principal.name || 'Principal')}`}
                                        alt={principal.name || 'Principal'}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{principal.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full w-fit mt-1">
                                            <Briefcase className="w-3 h-3" />
                                            Principal
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
                                    {principal.email}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {principal.phoneNumber || 'N/A'}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {principal.address || 'N/A'}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Joined</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {new Date(principal.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {principals.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-dashed border-2 border-gray-300 dark:border-gray-700">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Principals found</h3>
                            <p className="text-gray-500 mt-1">Get started by adding a new principal.</p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
