import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      );
    }

    // Get 5 most recent enquiries
    const recentEnquiries = await prisma.enquiry.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Ensure we always return an array even if there's an error
    const safeEnquiries = Array.isArray(recentEnquiries) ? recentEnquiries : [];

    return NextResponse.json(safeEnquiries);
  } catch (error) {
    console.error('Error fetching recent enquiries:', error);
    // Return an empty array instead of an error to prevent frontend crashes
    return NextResponse.json([]);
  }
} 