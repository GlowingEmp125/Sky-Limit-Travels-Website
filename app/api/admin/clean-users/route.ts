import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// EMERGENCY ENDPOINT - DELETE AFTER USE
// This completely removes all users and creates a fresh admin

export async function GET(request: NextRequest) {
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    
    // Delete all users
    const deleteResult = await prisma.user.deleteMany({});
    
    // Create fresh admin user with known working hash
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@skylimittravels.co.uk',
        password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTmrjFPGa.Msf0FbE3EFZz5ZlIH2gK', // Hash for 'Admin123!'
        role: 'ADMIN'
      }
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      deleted: deleteResult.count,
      message: 'All users removed and fresh admin created',
      login: {
        email: 'admin@skylimittravels.co.uk',
        password: 'Admin123!'
      }
    });
  } catch (error: any) {
    console.error('Error cleaning users table:', error);
    return NextResponse.json(
      { error: 'Failed to clean users table', details: error.message },
      { status: 500 }
    );
  }
} 