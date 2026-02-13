'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UnderConstruction from '@/components/common/UnderConstruction';

export default function MarksEntryPage() {
    return (
        <ProtectedRoute allowedRoles={['TEACHER']}>
            <UnderConstruction
                title="Marks & Grading"
                description="Enter exam marks, manage subject grades, and internal assessments."
            />
        </ProtectedRoute>
    );
}
