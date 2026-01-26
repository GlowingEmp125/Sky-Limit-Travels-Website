import { NextRequest, NextResponse } from 'next/server';
import { executeAsAdmin } from '@/lib/prisma-admin';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/admin/holidays/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check if user is authenticated
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Unauthorised' },
    //     { status: 401 }
    //   );
    // }

    const { id } = params;

    // Use executeAsAdmin for secure database access
    const destination = await executeAsAdmin(async (prisma) => {
      return await prisma.destination.findUnique({
        where: { id },
        include: {
          landingPageDestinations: true,
          landingPageTips: true
        }
      });
    });

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destination' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/holidays/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      );
    }

    const { id } = params;
    const data = await request.json();

    // Use executeAsAdmin for secure database access
    const destination = await executeAsAdmin(async (prisma) => {
      return await prisma.destination.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          from: data.from,
          popular: data.popular,
          destination: data.destination,
          duration: data.duration,
          price: parseFloat(data.price),
          slogan: data.slogan || null,
          discountUpTo: data.discountUpTo ? parseFloat(data.discountUpTo) : null,
          destinationImage: data.destinationImage || null,
          featured: data.featured || false,
          available: data.available || true,

          // Create related landing page destinations
          landingPageDestinations: {
            deleteMany: {},
            create: data.landingPageDestinations?.map((lpd: any) => ({
              from: lpd.from,
              destination: lpd.destination,
              duration: lpd.duration,
              price: parseFloat(lpd.price),
              date: new Date(lpd.date),
              stops: parseInt(lpd.stops) || 1,
              destinationImage: lpd.destinationImage || null
            })) || []
          },

          // Create related landing page tips
          landingPageTips: {
            deleteMany: {},
            create: data.landingPageTips?.map((tip: any) => ({
              title: tip.title,
              description: tip.description
            })) || []
          }
        },
        // include: {
        //   landingPageDestinations: true,
        //   landingPageTips: true
        // }
      });
    });

    return NextResponse.json(destination);
  } catch (error) {
    console.error('Error updating destination:', error);
    return NextResponse.json(
      { error: 'Failed to update destination' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/holidays/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Use executeAsAdmin for secure database access
    await executeAsAdmin(async (prisma) => {
      return await prisma.destination.delete({
        where: { id }
      });
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return NextResponse.json(
      { error: 'Failed to delete destination' },
      { status: 500 }
    );
  }
} 