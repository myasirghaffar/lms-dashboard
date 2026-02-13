'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function TeacherSchedulePage() {
    return (
        <ProtectedRoute allowedRoles={['BRANCH_ADMIN', 'SUPER_ADMIN']}>
            <UnderConstruction
                title="Teacher Schedules"
                description="View and manage teacher schedules, substitutions, and availability."
            />
        </ProtectedRoute>
    );
}
