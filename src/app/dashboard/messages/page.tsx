'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function MessagesPage() {
    return (
        <ProtectedRoute>
            <UnderConstruction
                title="Messages"
                description="Internal messaging system for communication."
            />
        </ProtectedRoute>
    );
}
