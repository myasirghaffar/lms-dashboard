'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function StudentFeesPage() {
    return (
        <ProtectedRoute allowedRoles={['STUDENT']}>
            <UnderConstruction
                title="My Fee Status"
                description="Track your payment history and outstanding fees."
            />
        </ProtectedRoute>
    );
}
