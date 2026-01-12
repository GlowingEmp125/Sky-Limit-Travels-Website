import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Admin credentials - in a real app, these would be in a secure environment variable
// but for simplicity, we're hardcoding them here
const ADMIN_EMAIL = 'admin@skylimittravels.co.uk';
const ADMIN_PASSWORD = 'Admin123!';
const ADMIN_NAME = 'Admin User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Simple authentication check
        if (
          credentials?.email === ADMIN_EMAIL &&
          credentials?.password === ADMIN_PASSWORD
        ) {
          // Return the admin user
          return {
            id: '1',
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            role: 'ADMIN',
          };
        }
        
        // Authentication failed
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
    signOut: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle sign out redirects
      if (url.startsWith('/signout') || url.startsWith('/api/auth/signout')) {
        return `${baseUrl}/admin/login`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  events: {
    signOut: async () => {
      // Custom signout logic can go here if needed
      console.log('User signed out');
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-fallback-secret-key',
}; 