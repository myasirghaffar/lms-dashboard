'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function SubjectsPage() {
    return (
        <ProtectedRoute allowedRoles={['BRANCH_ADMIN', 'SUPER_ADMIN']}>
            <UnderConstruction
                title="Subject Management"
                description="Define subjects, manage curriculum, and assign to classes."
            />
        </ProtectedRoute>
    );
}
