import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get 5 most recent trip plans
    const recentTripPlans = await prisma.tripPlan.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        destination: true,
        customerName: true,
        customerEmail: true,
        departureDate: true,
        returnDate: true,
        status: true,
        createdAt: true,
      },
    });

    // Ensure we always return an array even if there's an error
    const safeTripPlans = Array.isArray(recentTripPlans) ? recentTripPlans : [];

    return NextResponse.json(safeTripPlans);
  } catch (error) {
    console.error('Error fetching recent trip plans:', error);
    // Return an empty array instead of an error to prevent frontend crashes
    return NextResponse.json([]);
  }
} 