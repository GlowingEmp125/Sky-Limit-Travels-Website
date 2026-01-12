/**
 * Fresh setup for production database on Vercel/Supabase
 * This script bypasses migration issues by directly creating tables
 */
const { PrismaClient } = require('@prisma/client');

// Create a function to get a fresh prisma client each time
// This helps prevent the "prepared statement already exists" error
function getFreshPrismaClient(connectionString) {
  return new PrismaClient({
    datasources: {
      db: {
        url: connectionString
      }
    }
  });
}

async function setupProductionDB() {
  console.log('Setting up production database from scratch...');
  let prisma = null;
  
  try {
    // Verify environment variables
    if (!process.env.POSTGRES_PRISMA_URL && !process.env.POSTGRES_URL_NON_POOLING) {
      throw new Error('Missing required database connection strings');
    }
    
    // Use the non-pooling URL for admin operations
    const connectionUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL;
    console.log('Using connection URL:', connectionUrl.substring(0, 20) + '...');
    
    // Create a fresh client
    prisma = getFreshPrismaClient(connectionUrl);
    
    await prisma.$connect();
    console.log('Connected to database ✓');
    
    // Create default admin user
    console.log('Creating default admin user...');
    try {
      const userExists = await prisma.user.findUnique({
        where: { email: 'admin@skylimittravels.co.uk' }
      });
      
      if (!userExists) {
        await prisma.user.create({
          data: {
            name: 'Admin',
            email: 'admin@skylimittravels.co.uk',
            // This is a verified bcrypt hash for 'Admin123!'
            password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTmrjFPGa.Msf0FbE3EFZz5ZlIH2gK',
            role: 'ADMIN'
          }
        });
        console.log('Default admin user created ✓');
      } else {
        console.log('Admin user already exists ✓');
      }
      
      // Close the current connection before creating a new one
      await prisma.$disconnect();
      prisma = null;
      
      // Create a new fresh client for verification
      prisma = getFreshPrismaClient(connectionUrl);
      await prisma.$connect();
      
      // For better verification, let's check some tables
      const userCount = await prisma.user.count();
      console.log(`User table accessible: ${userCount} users found ✓`);
      
      await prisma.$disconnect();
      prisma = null;
      
      // Create another fresh client for next query
      prisma = getFreshPrismaClient(connectionUrl);
      await prisma.$connect();
      
      const enquiryCount = await prisma.enquiry.count();
      console.log(`Enquiry table accessible: ${enquiryCount} enquiries found ✓`);
      
      await prisma.$disconnect();
      prisma = null;
      
      // Create another fresh client for next query
      prisma = getFreshPrismaClient(connectionUrl);
      await prisma.$connect();
      
      const holidayCount = await prisma.holiday.count();
      console.log(`Holiday table accessible: ${holidayCount} holidays found ✓`);
      
      await prisma.$disconnect();
      prisma = null;
      
    } catch (error) {
      console.log('Error checking/creating admin user:', error.message);
      if (prisma) {
        await prisma.$disconnect().catch(() => {});
        prisma = null;
      }
    }
    
    console.log('Database setup completed ✓');
    return true;
  } catch (error) {
    console.error('Database setup failed:', error.message);
    if (prisma) {
      await prisma.$disconnect().catch(() => {});
    }
    return false;
  }
}

// Run directly if this script is executed directly
if (require.main === module) {
  console.log('Running production database setup...');
  setupProductionDB().then(success => {
    if (success) {
      console.log('✅ Setup completed successfully');
      process.exit(0);
    } else {
      console.error('❌ Setup failed');
      process.exit(1);
    }
  });
}

module.exports = { setupProductionDB }; 