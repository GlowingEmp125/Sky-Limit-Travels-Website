/**
 * Debug script to check the admin user and password in the database
 * This will verify that the password hash in the database can be used with Admin123!
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function debugAdminPassword(connectionString) {
  if (!connectionString) {
    console.error('Usage: node debug-admin-password.js "postgresql://YOUR_SUPABASE_CONNECTION_STRING"');
    process.exit(1);
  }

  console.log('Debugging admin password in production database...');
  
  const testPassword = 'Admin123!';
  const email = 'admin@skylimittravels.co.uk';
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: connectionString
      }
    }
  });
  
  try {
    await prisma.$connect();
    console.log('Connected to database ✓');
    
    // Get the admin user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('❌ Admin user not found in database!');
      return;
    }
    
    console.log('✅ Admin user found');
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.name}`);
    console.log(`Role: ${user.role}`);
    console.log(`Password hash in DB: ${user.password}`);
    
    // Test the password against what's in the database
    console.log('\nTesting password "Admin123!" against stored hash...');
    const isValidPassword = await bcrypt.compare(testPassword, user.password);
    
    if (isValidPassword) {
      console.log('✅ Password "Admin123!" is VALID for the stored hash');
    } else {
      console.log('❌ Password "Admin123!" is INVALID for the stored hash');
      
      // Try to fix by updating with known good hash
      console.log('\nAttempting to fix by updating with known good hash...');
      const knownGoodHash = '$2a$10$CwTycUXWue0Thq9StjUM0uQxTmrjFPGa.Msf0FbE3EFZz5ZlIH2gK';
      
      // Verify the known good hash works with the password
      const isKnownGoodValid = await bcrypt.compare(testPassword, knownGoodHash);
      console.log(`Known good hash validation: ${isKnownGoodValid ? 'VALID ✓' : 'INVALID ✗'}`);
      
      if (isKnownGoodValid) {
        await prisma.user.update({
          where: { email },
          data: { password: knownGoodHash }
        });
        console.log('✅ Updated admin password with known good hash');
      }
    }
  } catch (error) {
    console.error('Error debugging admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get the connection string from command line argument
const connectionString = process.argv[2];
debugAdminPassword(connectionString); 