'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function AdminsPage() {
    return (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <UnderConstruction
                title="Admin Management"
                description="Manage system administrators and branch admins."
            />
        </ProtectedRoute>
    );
}
