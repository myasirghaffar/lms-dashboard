'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function PrincipalsPage() {
    return (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <UnderConstruction
                title="Principal Management"
                description="Manage school principals and their assignments."
            />
        </ProtectedRoute>
    );
}
