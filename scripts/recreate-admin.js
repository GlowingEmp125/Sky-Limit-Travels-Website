/**
 * Clean slate approach - delete all users and recreate admin
 */
const { PrismaClient } = require('@prisma/client');

async function recreateAdmin(connectionString) {
  if (!connectionString) {
    console.error('Usage: node recreate-admin.js "postgresql://YOUR_SUPABASE_CONNECTION_STRING"');
    process.exit(1);
  }

  console.log('Starting clean slate admin recreation...');
  
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
    
    // Delete all users
    console.log('Deleting all existing users...');
    const deleteResult = await prisma.user.deleteMany({});
    console.log(`Deleted ${deleteResult.count} users from the database`);
    
    // Create fresh admin user with the known working hash
    console.log('Creating fresh admin user...');
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@skylimittravels.co.uk',
        password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTmrjFPGa.Msf0FbE3EFZz5ZlIH2gK', // Hash for 'Admin123!'
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Successfully recreated admin user!');
    console.log('Login with:');
    console.log('Email: admin@skylimittravels.co.uk');
    console.log('Password: Admin123!');
    
  } catch (error) {
    console.error('Error recreating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get the connection string from command line argument
const connectionString = process.argv[2];
recreateAdmin(connectionString); 