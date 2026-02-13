'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function StudentsPage() {
    return (
        <ProtectedRoute allowedRoles={['BRANCH_ADMIN', 'SUPER_ADMIN']}>
            <UnderConstruction
                title="Student Management"
                description="View and manage all student records, enrollment details, and academic progress."
            />
        </ProtectedRoute>
    );
}
