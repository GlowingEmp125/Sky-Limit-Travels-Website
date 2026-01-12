import { NextResponse } from 'next/server';
import { prismaPublic } from '@/lib/prisma-admin';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const tripPlanData = await request.json();
    
    // Validate required fields
    if (!tripPlanData.customerEmail || !tripPlanData.customerName || !tripPlanData.destination) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create trip plan in database using public client (allowed by RLS policies)
    const tripPlan = await prismaPublic.tripPlan.create({
      data: {
        destination: tripPlanData.destination,
        tripType: tripPlanData.tripType || 'both',
        departureDate: new Date(tripPlanData.departureDate),
        returnDate: new Date(tripPlanData.returnDate),
        adults: parseInt(tripPlanData.adults) || 1,
        children: parseInt(tripPlanData.children) || 0,
        infants: parseInt(tripPlanData.infants) || 0,
        customerName: tripPlanData.customerName,
        customerEmail: tripPlanData.customerEmail,
        status: 'PENDING', // Use uppercase to match enum convention
      },
    });

    // Revalidate admin panel page to show new trip plan immediately
    revalidatePath('/admin/trip-plans');

    return NextResponse.json({ success: true, tripPlan });
  } catch (error) {
    console.error('Error creating trip plan:', error);
    
    // Return more detailed error message if available
    const errorMessage = error instanceof Error ? error.message : 'Failed to create trip plan';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 