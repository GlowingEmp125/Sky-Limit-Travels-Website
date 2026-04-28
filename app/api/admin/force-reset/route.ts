import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";

// EMERGENCY ENDPOINT - DELETE AFTER USE
// This directly sets the known working hash without any bcrypt operations

export async function GET(request: NextRequest) {
  try {
    // Skip during build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json(
        { message: 'This endpoint is skipped during build' },
        { status: 503 }
      );
    }

    // Validate database URL
    if (!process.env.POSTGRES_PRISMA_URL) {
      return NextResponse.json(
        { error: 'Database URL not configured' },
        { status: 500 }
      );
    }

    const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_PRISMA_URL });
    const prisma = new PrismaClient({ adapter });
    await prisma.$connect();
    
    const adminEmail = 'admin@skylimittravels.co.uk';
    
    // This is the verified working hash for 'Admin123!'
    // This exact hash is used in setup-production-db.js
    const knownWorkingHash = '$2a$10$CwTycUXWue0Thq9StjUM0uQxTmrjFPGa.Msf0FbE3EFZz5ZlIH2gK';
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (existingUser) {
      // Update admin with the known working hash
      await prisma.user.update({
        where: { email: adminEmail },
        data: { 
          password: knownWorkingHash,
          // Add timestamp to force update
          updatedAt: new Date()
        }
      });
      
      await prisma.$disconnect();
      
      return NextResponse.json({
        success: true,
        message: 'Admin password has been force-reset to the known working hash',
        login: {
          email: adminEmail,
          password: 'Admin123!'
        }
      });
    } else {
      // Create admin if it doesn't exist
      await prisma.user.create({
        data: {
          name: 'Admin',
          email: adminEmail,
          password: knownWorkingHash,
          role: 'ADMIN'
        }
      });
      
      await prisma.$disconnect();
      
      return NextResponse.json({
        success: true,
        message: 'Admin user created with known working hash',
        login: {
          email: adminEmail,
          password: 'Admin123!'
        }
      });
    }
  } catch (error: any) {
    console.error('Error force-resetting admin password:', error);
    return NextResponse.json(
      { error: 'Failed to reset admin password', details: error.message },
      { status: 500 }
    );
  }
} 