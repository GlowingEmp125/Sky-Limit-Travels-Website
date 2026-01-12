'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut({ redirect: false });
        router.push('/admin/login');
        
        // Fallback direct redirect
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 500);
      } catch (error) {
        console.error('Error during logout:', error);
        window.location.href = '/admin/login';
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold">Signing Out...</h2>
        <p className="text-gray-600">You are being logged out and redirected to the login page.</p>
        <div className="mt-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <button
          onClick={() => window.location.href = '/admin/login'}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go to Login Page
        </button>
      </div>
    </div>
  );
} 