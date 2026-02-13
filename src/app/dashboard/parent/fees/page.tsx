'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function ParentFeesPage() {
    return (
        <ProtectedRoute allowedRoles={['PARENT']}>
            <UnderConstruction
                title="Fee Payments"
                description="View fee invoices, make payments online, and download receipts."
            />
        </ProtectedRoute>
    );
}
