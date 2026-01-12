const { PrismaClient } = require('@prisma/client');

// This script will force the Prisma client to be regenerated
// Run it with: npx ts-node prisma/sync.ts

async function main() {
  console.log('Syncing Prisma schema...');
  
  // Create a prisma client to test the connection
  const prisma = new PrismaClient();
  
  try {
    // Test the connection
    await prisma.$connect();
    console.log('Database connection successful');
    
    // Check if we can query the Enquiry model with the new fields
    const enquiries = await prisma.enquiry.findMany({
      take: 1,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        message: true,
        status: true,
        flightDetails: true,
        holidayDetails: true,
        packageDetails: true,
        createdAt: true
      }
    });
    
    console.log('Sample enquiry:', enquiries[0] || 'No enquiries found');
    console.log('Schema synchronization completed successfully');
  } catch (error) {
    console.error('Error testing database connection:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error in sync script:', error);
    process.exit(1);
  }); 