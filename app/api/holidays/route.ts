import { NextResponse } from 'next/server';
import { prismaPublic } from '@/lib/prisma-admin';

export const dynamic = 'force-dynamic';

// GET /api/holidays - Public endpoint for displaying available holidays
export async function GET(request: Request) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const destination = searchParams.get('destination');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build where clause
    const where: any = {
      available: true, // Only show available holidays to public
    };

    if (featured === 'true') {
      where.featured = true;
    }

    if (destination) {
      where.destination = {
        contains: destination,
        mode: 'insensitive',
      };
    }

    // Use prismaPublic for public access (allowed by RLS policies)
    const holidays = await prismaPublic.holiday.findMany({
      where,
      orderBy: [
        { featured: 'desc' }, // Featured holidays first
        { createdAt: 'desc' }  // Then by newest
      ],
      take: limit,
    });

    return NextResponse.json(holidays);
  } catch (error) {
    console.error('Error fetching public holidays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch holidays' },
      { status: 500 }
    );
  }
} 