'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function TimetablePage() {
    return (
        <ProtectedRoute allowedRoles={['BRANCH_ADMIN', 'SUPER_ADMIN']}>
            <UnderConstruction
                title="Timetable Management"
                description="Create and manage class timetables, assign periods, and generate schedules."
            />
        </ProtectedRoute>
    );
}
