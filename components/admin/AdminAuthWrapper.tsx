'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ReactNode } from 'react';

export default function AdminAuthWrapper({
  children,
  adminOnly = false,
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) {
  const { isAuthorized, isLoading, isAdmin } = useAdminAuth();

  // If still loading, show loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If route requires admin privilege and user is not admin
  if (adminOnly && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // If authorized, render children
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Default - should not reach here due to redirect in useAdminAuth
  return null;
} 