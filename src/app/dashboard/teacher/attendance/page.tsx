'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function AttendanceMarkingPage() {
    return (
        <ProtectedRoute allowedRoles={['TEACHER']}>
            <UnderConstruction
                title="Mark Attendance"
                description="Mark and submit daily student attendance records."
            />
        </ProtectedRoute>
    );
}
