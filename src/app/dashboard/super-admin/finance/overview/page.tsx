'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function FinanceOverviewPage() {
    return (
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <UnderConstruction
                title="Finance Overview"
                description="Comprehensive financial reports, revenue tracking, and expense management."
            />
        </ProtectedRoute>
    );
}
