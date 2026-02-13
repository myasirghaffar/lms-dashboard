'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function AnnouncementsPage() {
    return (
        <ProtectedRoute>
            <UnderConstruction
                title="Announcements"
                description="View latest school news and important updates."
            />
        </ProtectedRoute>
    );
}
