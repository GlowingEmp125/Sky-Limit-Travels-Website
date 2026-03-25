"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAdminAuth() {

  const { data: session, status } = useSession();
  
  const router = useRouter();
  
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.push('/admin/login');
        return;
      }

      if (status === 'authenticated') {
        try {
          // Additional server-side check
          const response = await fetch('/api/admin/check-auth');
          const data = await response.json();

          if (!data.authenticated) {
            router.push('/admin/login');
            return;
          }

          setIsAuthorized(true);
        } catch (error) {
          console.error('Auth verification error:', error);
          router.push('/admin/login');
        } finally {
          setIsLoading(false);
        }
      }
    }

    checkAuth();
  }, [status, router]);

  return {
    session,
    isAuthorized,
    isLoading,
    isAdmin: session?.user?.role === 'ADMIN',
    isStaff: session?.user?.role === 'STAFF',
  };
} 