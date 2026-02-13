'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function MyChildrenAttendancePage() {
    return (
        <ProtectedRoute allowedRoles={['PARENT']}>
            <UnderConstruction
                title="Children Attendance"
                description="Monitor daily attendance records of your children."
            />
        </ProtectedRoute>
    );
}
