'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function StudentResultsPage() {
    return (
        <ProtectedRoute allowedRoles={['STUDENT']}>
            <UnderConstruction
                title="My Results"
                description="View your exam results, grades, and academic performance."
            />
        </ProtectedRoute>
    );
}
