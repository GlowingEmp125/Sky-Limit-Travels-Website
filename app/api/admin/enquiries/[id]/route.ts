import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { executeAsAdmin } from '@/lib/prisma-admin';

export const dynamic = 'force-dynamic';

// Helper function to check if user is authenticated
async function isAuthenticated() {
  const session = await getServerSession();
  return !!session?.user;
}

// GET single enquiry by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use executeAsAdmin for secure database access
    const enquiry = await executeAsAdmin(async (prisma) => {
      return await prisma.enquiry.findUnique({
        where: {
          id: params.id,
        },
      });
    });

    if (!enquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(enquiry);
  } catch (error) {
    console.error('Error fetching enquiry details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiry details' },
      { status: 500 }
    );
  }
} 