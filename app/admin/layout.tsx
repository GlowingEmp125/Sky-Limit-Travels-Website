'use client';

import { usePathname } from 'next/navigation';
import AdminAuthWrapper from '@/components/admin/AdminAuthWrapper';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Providers } from '../providers';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname?.startsWith( '/admin/login');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Exclude auth wrapper for login page */}
      <Providers>

      {isLoginPage ? (
        <>{children}</>
      ) : (
        <AdminAuthWrapper>
          <div className="flex">
            <AdminSidebar />
            <main className="flex-1 p-6 overflow-y-auto">
              {children}
            </main>
          </div>
         </AdminAuthWrapper>
      )}
      </Providers>
    </div>
  );
} 