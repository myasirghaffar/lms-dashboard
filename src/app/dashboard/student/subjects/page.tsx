'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function MySubjectsPage() {
    return (
        <ProtectedRoute allowedRoles={['STUDENT']}>
            <UnderConstruction
                title="My Subjects"
                description="View your enrolled subjects and course materials."
            />
        </ProtectedRoute>
    );
}
