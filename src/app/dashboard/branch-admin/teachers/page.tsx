'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function TeachersPage() {
    return (
        <ProtectedRoute allowedRoles={['BRANCH_ADMIN', 'SUPER_ADMIN']}>
            <UnderConstruction
                title="Teacher Management"
                description="View teacher profiles, assign subjects, and manage staff."
            />
        </ProtectedRoute>
    );
}
