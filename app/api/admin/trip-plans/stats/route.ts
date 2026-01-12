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

    // Initialize with safe defaults
    let totalTripPlans = 0;
    let pendingTripPlans = 0;

    try {
      // Get total count of trip plans
      totalTripPlans = await prisma.tripPlan.count();

      // Get count of pending trip plans
      pendingTripPlans = await prisma.tripPlan.count({
        where: {
          status: 'PENDING',
        },
      });
    } catch (dbError) {
      console.error('Database error when fetching trip plan stats:', dbError);
      // Continue with zeros instead of failing completely
    }

    return NextResponse.json({
      totalTripPlans,
      pendingTripPlans,
    });
  } catch (error) {
    console.error('Error fetching trip plan stats:', error);
    // Return zeros instead of error to prevent frontend crashes
    return NextResponse.json({
      totalTripPlans: 0,
      pendingTripPlans: 0,
    });
  }
} 