'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type UserRole = 'SUPER_ADMIN' | 'BRANCH_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export default function DashboardHome() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/signin');
        return;
      }

      // Redirect to role-specific dashboard
      const roleRoutes: Record<UserRole, string> = {
        SUPER_ADMIN: '/dashboard/super-admin',
        BRANCH_ADMIN: '/dashboard/branch-admin',
        TEACHER: '/dashboard/teacher',
        STUDENT: '/dashboard/student',
        PARENT: '/dashboard/parent',
      };

      router.push(roleRoutes[user.role]);
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
      </div>
    </div>
  );
}
