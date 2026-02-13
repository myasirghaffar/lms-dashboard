'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function StudentTimetablePage() {
    return (
        <ProtectedRoute allowedRoles={['STUDENT']}>
            <UnderConstruction
                title="My Timetable"
                description="View your weekly class schedule and timings."
            />
        </ProtectedRoute>
    );
}
