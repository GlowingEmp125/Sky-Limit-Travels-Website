import { NextResponse } from 'next/server';
import { executeAsAdmin } from '@/lib/prisma-admin';
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

    // Use executeAsAdmin for secure database access
    const stats = await executeAsAdmin(async (prisma) => {
      try {
        // Get all stats in parallel for better performance
        const [totalEnquiries, newEnquiries, totalHolidays] = await Promise.all([
          prisma.enquiry.count(),
          prisma.enquiry.count({
            where: {
              status: 'NEW'
            }
          }),
          prisma.holiday.count()
        ]);

        return {
          totalEnquiries,
          newEnquiries,
          totalHolidays
        };
      } catch (dbError) {
        console.error('Database error when fetching stats:', dbError);
        // Return zeros instead of failing completely
        return {
          totalEnquiries: 0,
          newEnquiries: 0,
          totalHolidays: 0
        };
      }
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    // Return zeros instead of error to prevent frontend crashes
    return NextResponse.json({
      totalEnquiries: 0,
      newEnquiries: 0,
      totalHolidays: 0
    });
  }
} 