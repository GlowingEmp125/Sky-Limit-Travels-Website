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
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorised' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Use executeAsAdmin for secure database access
    const holiday = await executeAsAdmin(async (prisma) => {
      return await prisma.holiday.findUnique({
        where: { id }
      });
    });

    if (!holiday) {
      return NextResponse.json(
        { error: 'Holiday not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(holiday);
  } catch (error) {
    console.error('Error fetching holiday:', error);
    return NextResponse.json(
      { error: 'Failed to fetch holiday' },
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
    const holiday = await executeAsAdmin(async (prisma) => {
      return await prisma.holiday.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          destination: data.destination,
          duration: data.duration,
          price: data.price,
          imageUrl: data.imageUrl,
          featured: data.featured,
          available: data.available
        }
      });
    });

    return NextResponse.json(holiday);
  } catch (error) {
    console.error('Error updating holiday:', error);
    return NextResponse.json(
      { error: 'Failed to update holiday' },
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
      return await prisma.holiday.delete({
        where: { id }
      });
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting holiday:', error);
    return NextResponse.json(
      { error: 'Failed to delete holiday' },
      { status: 500 }
    );
  }
} 