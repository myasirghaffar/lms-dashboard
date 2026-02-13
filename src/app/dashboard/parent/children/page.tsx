'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function MyChildrenPage() {
    return (
        <ProtectedRoute allowedRoles={['PARENT']}>
            <UnderConstruction
                title="My Children"
                description="View overview of all your children enrolled in the school."
            />
        </ProtectedRoute>
    );
}
