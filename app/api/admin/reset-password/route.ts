import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

// IMPORTANT: Delete this file after use - it's only for emergency admin reset
// This is not secure for production use

export async function GET(request: NextRequest) {
  // Check for a secret token in the URL to prevent unauthorized access
  const url = new URL(request.url);
  const secretToken = url.searchParams.get('token');
  
  // This should match the ADMIN_PASSWORD environment variable
  const expectedToken = process.env.ADMIN_PASSWORD;
  
  if (!secretToken || secretToken !== expectedToken) {
    return NextResponse.json(
      { error: 'Unauthorized access' },
      { status: 401 }
    );
  }
  
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    
    const adminEmail = 'admin@skylimittravels.co.uk';
    const adminPassword = 'Admin123!';
    
    // Generate a fresh hash
    const hashedPassword = await hash(adminPassword, 10);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (existingUser) {
      // Update existing admin
      await prisma.user.update({
        where: { email: adminEmail },
        data: { password: hashedPassword }
      });
    } else {
      // Create admin if it doesn't exist
      await prisma.user.create({
        data: {
          name: 'Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
    }
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      message: 'Admin password has been reset',
      login: {
        email: adminEmail,
        password: adminPassword
      }
    });
  } catch (error) {
    console.error('Error resetting admin password:', error);
    return NextResponse.json(
      { error: 'Failed to reset admin password', details: error },
      { status: 500 }
    );
  }
} 