'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Building2, MapPin, Phone, Users, MoreHorizontal } from 'lucide-react';
import { getBranches, getStudents, getTeachers } from '@/lib/api';
import AddBranchModal from '@/components/dashboard/branches/AddBranchModal';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';

export default function BranchesPage() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [branchToDelete, setBranchToDelete] = React.useState<string | null>(null);
    const branchesData = getBranches();
    const studentsData = getStudents();
    const teachersData = getTeachers();

    const branches = branchesData.map(branch => ({
        id: branch.id,
        name: branch.name,
        location: branch.address || 'No Address',
        contact: branch.phoneNumber || 'No Contact',
        principal: 'Principal Name',
        students: studentsData.filter(s => s.branchId === branch.id).length,
        teachers: teachersData.filter(t => t.branchId === branch.id).length,
        status: 'Active'
    }));

    return (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Branches Management</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all school branches and campuses</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Building2 className="w-4 h-4" />
                        Add Branch
                    </button>
                </div>

                <AddBranchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

                <ConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={() => {
                        console.log('Deleting branch:', branchToDelete);
                        // Add deletion logic here
                    }}
                    title="Delete Branch"
                    message="Are you sure you want to delete this branch? This action cannot be undone and will affect all students and teachers assigned to it."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.map((branch) => (
                        <div key={branch.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{branch.name}</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {branch.location}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {branch.contact}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <Users className="w-4 h-4 mr-2" />
                                    {branch.principal}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Students</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{branch.students}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Teachers</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{branch.teachers}</p>
                                </div>
                                <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded-full font-medium">
                                    {branch.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ProtectedRoute>
    );
}
