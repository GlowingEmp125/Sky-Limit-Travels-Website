import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaPg } from "@prisma/adapter-pg";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Skip during build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json(
        { error: 'Not available during build' },
        { status: 503 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create adapter and client inside the function
    const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_PRISMA_URL });
    const prisma = new PrismaClient({ adapter });

    const { id } = params;

    // Get trip plan by ID
    const tripPlan = await prisma.tripPlan.findUnique({
      where: { id },
    });

    if (!tripPlan) {
      return NextResponse.json(
        { error: 'Trip plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tripPlan);
  } catch (error) {
    console.error('Error fetching trip plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trip plan' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Skip during build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json(
        { error: 'Not available during build' },
        { status: 503 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create adapter and client inside the function
    const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_PRISMA_URL });
    const prisma = new PrismaClient({ adapter });

    const { id } = params;
    const data = await request.json();
    
    // Find if trip plan exists
    const existingTripPlan = await prisma.tripPlan.findUnique({
      where: { id },
    });

    if (!existingTripPlan) {
      return NextResponse.json(
        { error: 'Trip plan not found' },
        { status: 404 }
      );
    }

    // Update trip plan
    const updatedTripPlan = await prisma.tripPlan.update({
      where: { id },
      data: {
        status: data.status !== undefined ? data.status : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
        assignedTo: data.assignedTo !== undefined ? data.assignedTo : undefined,
        destination: data.destination !== undefined ? data.destination : undefined,
        tripType: data.tripType !== undefined ? data.tripType : undefined,
        departureDate: data.departureDate !== undefined ? new Date(data.departureDate) : undefined,
        returnDate: data.returnDate !== undefined ? new Date(data.returnDate) : undefined,
        adults: data.adults !== undefined ? data.adults : undefined,
        children: data.children !== undefined ? data.children : undefined,
        infants: data.infants !== undefined ? data.infants : undefined,
        customerName: data.customerName !== undefined ? data.customerName : undefined,
        customerEmail: data.customerEmail !== undefined ? data.customerEmail : undefined,
      },
    });

    return NextResponse.json(updatedTripPlan);
  } catch (error) {
    console.error('Error updating trip plan:', error);
    return NextResponse.json(
      { error: 'Failed to update trip plan' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Skip during build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json(
        { error: 'Not available during build' },
        { status: 503 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create adapter and client inside the function
    const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_PRISMA_URL });
    const prisma = new PrismaClient({ adapter });

    const { id } = params;

    // Find if trip plan exists
    const existingTripPlan = await prisma.tripPlan.findUnique({
      where: { id },
    });

    if (!existingTripPlan) {
      return NextResponse.json(
        { error: 'Trip plan not found' },
        { status: 404 }
      );
    }

    // Delete trip plan
    await prisma.tripPlan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trip plan:', error);
    return NextResponse.json(
      { error: 'Failed to delete trip plan' },
      { status: 500 }
    );
  }
} 