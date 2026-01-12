import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

// TEMPORARY EMERGENCY ENDPOINT - DELETE AFTER USE
// This endpoint allows resetting the admin password by providing the database connection string
// This is NOT secure and should be deleted immediately after use

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  
  // Get the connection string from URL params (encoded as base64 for safety)
  const encodedConnectionString = url.searchParams.get('db');
  
  if (!encodedConnectionString) {
    return NextResponse.json(
      { error: 'Missing database connection parameter' },
      { status: 400 }
    );
  }
  
  try {
    // Decode the connection string
    const connectionString = Buffer.from(encodedConnectionString, 'base64').toString('utf-8');
    
    // Safety check - ensure it's a PostgreSQL connection
    if (!connectionString.startsWith('postgresql://') && !connectionString.startsWith('postgres://')) {
      return NextResponse.json(
        { error: 'Invalid database connection string' },
        { status: 400 }
      );
    }
    
    // Create prisma client with the connection string
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: connectionString
        }
      }
    });
    
    await prisma.$connect();
    
    const adminEmail = 'admin@skylimittravels.co.uk';
    const adminPassword = 'Admin123!';
    
    // Use a fixed salt for consistent hashing that works across environments
    // This is the salt from the original hash in setup-production-db.js
    const salt = '$2a$10$CwTycUXWue0Thq9StjUM0u';
    const hashedPassword = '$2a$10$CwTycUXWue0Thq9StjUM0uQxTmrjFPGa.Msf0FbE3EFZz5ZlIH2gK';
    
    // This is the hash that was originally used in setup-production-db.js
    console.log('Using predefined hash for Admin123!');
    
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
  } catch (error: any) {
    console.error('Error resetting admin password:', error);
    return NextResponse.json(
      { error: 'Failed to reset admin password', details: error.message },
      { status: 500 }
    );
  }
} 