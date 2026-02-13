'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function TeacherAssignmentsPage() {
    return (
        <ProtectedRoute allowedRoles={['TEACHER']}>
            <UnderConstruction
                title="Manage Assignments"
                description="Create assignments, manage submissions, and provide feedback."
            />
        </ProtectedRoute>
    );
}
