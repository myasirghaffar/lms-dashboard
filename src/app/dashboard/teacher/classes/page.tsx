'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function MyClassesPage() {
    return (
        <ProtectedRoute allowedRoles={['TEACHER']}>
            <UnderConstruction
                title="My Classes"
                description="View your assigned classes, subject details, and student lists."
            />
        </ProtectedRoute>
    );
}
