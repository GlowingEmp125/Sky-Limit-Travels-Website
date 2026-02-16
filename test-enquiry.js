const { PrismaClient } = require('@prisma/client');

import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_PRISMA_URL });

 const prisma = new PrismaClient({ adapter });

async function testEnquiry() {
  try {
    console.log('Testing enquiry creation...');
    
    // Test data
    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '03330384142',
      message: 'I would like to enquire about flights to Spain for next month.',
      type: 'FLIGHT',
      status: 'NEW',
      flightDetails: JSON.stringify({
        origin: 'LHR',
        destination: 'JFK',
        departureDate: '2024-06-01'
      }),
      source: 'test'
    };

    // Create enquiry
    const enquiry = await prisma.enquiry.create({
      data: testData
    });

    console.log('✅ Enquiry created successfully:', enquiry);

    // Fetch all enquiries
    const allEnquiries = await prisma.enquiry.findMany();
    console.log('📋 Total enquiries in database:', allEnquiries.length);

    // Clean up test data
    await prisma.enquiry.delete({
      where: { id: enquiry.id }
    });

    console.log('🧹 Test enquiry cleaned up');
    console.log('✅ Database is working correctly!');

  } catch (error) {
    console.error('❌ Error testing enquiry:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEnquiry(); 