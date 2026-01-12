// Setup script for Vercel Postgres database
const { execSync } = require('child_process');
const { withPrisma, listTables } = require('../lib/vercel-db-helper');

async function setupVercelDatabase() {
  console.log('Setting up database for Vercel deployment...');
  
  try {
    // 1. Check environment variables
    if (!process.env.POSTGRES_PRISMA_URL) {
      throw new Error('POSTGRES_PRISMA_URL environment variable is not set');
    }
    
    if (!process.env.POSTGRES_URL_NON_POOLING) {
      console.warn('Warning: POSTGRES_URL_NON_POOLING is not set. This might cause issues with Prisma migrations');
    }
    
    // 2. Run database migration with explicit URL to ensure tables are created
    console.log('\nPreparing to run Prisma migrate deploy...');
    try {
      console.log('Running prisma migrate deploy...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('Migration completed successfully ✓');
    } catch (migrationError) {
      console.error('Error during migration:', migrationError);
      
      // If migration fails, try to create tables directly through schema push as fallback
      console.log('\nAttempting fallback: prisma db push...');
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
      console.log('Schema push completed ✓');
    }
    
    // 3. Check if tables exist using our helper function
    console.log('\nChecking database tables...');
    const tables = await listTables();
    
    console.log('Tables in database:');
    tables.forEach(table => console.log(`- ${table.table_name}`));
    
    // 4. Basic data seed to ensure at least one admin user exists
    // Using withPrisma helper to avoid prepared statement conflicts
    await withPrisma(async (prisma) => {
      console.log('\nChecking for admin user...');
      const userCount = await prisma.user.count();
      
      if (userCount === 0) {
        console.log('No users found. Creating default admin user...');
        
        // Create a default admin user
        await prisma.user.create({
          data: {
            name: 'Admin',
            email: 'admin@skylimittravels.co.uk',
            password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTmrjFPGa.Msf0FbE3EFZz5ZlIH2gK', // Admin123!
            role: 'ADMIN'
          }
        });
        
        console.log('Default admin user created ✓');
      } else {
        console.log(`Found ${userCount} existing users in database`);
      }
    });
    
    console.log('\nDatabase setup complete! ✓');
    return true;
    
  } catch (error) {
    console.error('\nDatabase setup failed!');
    console.error(`Error: ${error.message}`);
    console.error(error.stack);
    return false;
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupVercelDatabase().then(success => {
    if (success) {
      console.log('\n✅ Vercel database setup successful!');
      process.exit(0);
    } else {
      console.error('\n❌ Vercel database setup failed!');
      process.exit(1);
    }
  });
}

module.exports = { setupVercelDatabase }; 