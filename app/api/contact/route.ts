import { NextRequest, NextResponse } from 'next/server';
import { prismaPublic } from '@/lib/prisma-admin';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log('=== ENQUIRY API CALLED ===');
  
  try {
    console.log('Step 1: Validating content type...');
    // Validate request content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Invalid content type:', contentType);
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }
    console.log('✅ Content type valid');

    console.log('Step 2: Parsing request body...');
    let data;
    try {
      data = await request.json();
    } catch (error) {
      console.error('Error parsing request JSON:', error);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    console.log('✅ JSON parsed successfully');

    console.log('Step 3: Logging received data...');
    console.log('Contact form submission received:', { 
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      messageLength: data.message?.length || 0,
      enquiryType: data.enquiryType,
      flightDetails: data.flightDetails ? 'Present' : 'Not present',
      holidayDetails: data.holidayDetails ? 'Present' : 'Not present',
      packageDetails: data.packageDetails ? 'Present' : 'Not present',
      timestamp: new Date().toISOString()
    });
    
    console.log('Step 4: Validating required fields...');
    // Validate the required fields
    const missingFields = [];
    if (!data.firstName) missingFields.push('firstName');
    if (!data.lastName) missingFields.push('lastName');
    if (!data.email) missingFields.push('email');
    if (!data.message) missingFields.push('message');

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    console.log('✅ All required fields present');

    console.log('Step 5: Validating email format...');
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      console.error('Invalid email format:', data.email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    console.log('✅ Email format valid');
    
    console.log('Step 6: Testing database connection...');
    // Test database connection first using public client
    try {
      await prismaPublic.$queryRaw`SELECT 1 as test`;
      console.log('✅ Database connection successful');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed', details: dbError.message },
        { status: 500 }
      );
    }
    
    console.log('Step 7: Preparing data for database...');
    // Save to database
    try {
      // Create a base data object with minimal fields
      const baseData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
        status: 'NEW' as const,
        type: data.enquiryType || 'GENERAL'
      };

      console.log('Base data prepared:', {
        ...baseData,
        message: baseData.message.substring(0, 50) + '...'
      });

      console.log('Step 8: Creating database record...');
      // Use prismaPublic for public form submission (allowed by RLS policies)
      const savedEnquiry = await prismaPublic.enquiry.create({
        data: {
          ...baseData,
          flightDetails: data.flightDetails ? JSON.stringify(data.flightDetails) : null,
          holidayDetails: data.holidayDetails ? JSON.stringify(data.holidayDetails) : null,
          packageDetails: data.packageDetails ? JSON.stringify(data.packageDetails) : null,
        }
      });
      
      console.log('✅ Enquiry saved to database with ID:', savedEnquiry.id);
      
      // Return success response
      return NextResponse.json({
        success: true,
        message: 'Thank you for your enquiry. We will contact you shortly.',
        enquiryId: savedEnquiry.id
      });
    } catch (error) {
      console.error('❌ Error saving enquiry to database:', error);
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      
      return NextResponse.json(
        { 
          error: 'Failed to save your enquiry. Please try again later or contact us by phone.',
          details: error instanceof Error ? error.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    // Ensure all errors are properly logged
    console.error('❌ Error processing contact form submission:', error);
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    
    // Always return a JSON response, even for unexpected errors
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred. Please try again later or contact us by phone.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 