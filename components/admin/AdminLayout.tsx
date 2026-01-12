'use client';

import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar (fixed) */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="md:ml-64 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
