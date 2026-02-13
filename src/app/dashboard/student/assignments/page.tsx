'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function StudentAssignmentsPage() {
    return (
        <ProtectedRoute allowedRoles={['STUDENT']}>
            <UnderConstruction
                title="My Assignments"
                description="View and submit your homework and assignments."
            />
        </ProtectedRoute>
    );
}
