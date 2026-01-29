import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { executeAsAdmin } from '@/lib/prisma-admin';
import { EnquiryStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Helper function to check if user is authenticated
async function isAuthenticated() {
  const session = await getServerSession();
  return !!session?.user;
}

// GET all enquiries
export async function GET(request: Request) {
  try {
    // Check if user is authenticated
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query
    const where = statusParam
      ? { status: statusParam as EnquiryStatus }
      : {};

    // Use executeAsAdmin for secure database access
    const result = await executeAsAdmin(async (prisma) => {
      // Get enquiries with pagination
      const enquiries = await prisma.enquiry.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });

      // Get total count for pagination
      const total = await prisma.enquiry.count({ where });

      return {
        enquiries,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}

// PATCH to update an enquiry status
export async function PATCH(request: Request) {
  try {
    // Check if user is authenticated
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use executeAsAdmin for secure database access
    const updatedEnquiry = await executeAsAdmin(async (prisma) => {
      return await prisma.enquiry.update({
        where: { id },
        data: { status: status as EnquiryStatus },
      });
    });

    return NextResponse.json(updatedEnquiry);
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update enquiry' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {


    // Get destination data from request body
    const data = await request.json();

    const { firstName, lastName, email, phone } = data;

    // Use executeAsAdmin for secure database access
    const enquiry = await executeAsAdmin(async (prisma) => {
      return await prisma.enquiry.create({
        data: {
          firstName: firstName || "",
          lastName: lastName || "",
          email: email || "",
          phone: phone || "",
          message: data.message || "",
          status: "NEW",
        }
      });
    });

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create enquiry' },
      { status: 500 }
    );
  }
}