'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function ChildrenPerformancePage() {
    return (
        <ProtectedRoute allowedRoles={['PARENT']}>
            <UnderConstruction
                title="Children Performance"
                description="View detailed academic reports and grade history for your children."
            />
        </ProtectedRoute>
    );
}
