import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  // Augment the request
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        // Only allow access if user has a valid token
        return !!token;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

// Apply middleware to admin routes only, but exclude the login page
export const config = {
  matcher: [
    '/admin/((?!login).*)' // Match all admin routes except login
  ],
}; 