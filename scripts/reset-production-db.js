/**
 * Database reset script for PostgreSQL on Vercel/Supabase
 * WARNING: This script will completely delete all database tables and data
 */
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const { setupProductionDB } = require('./setup-production-db');

// Get a fresh client for each operation
function getFreshClient() {
  // Using the non-pooling URL helps avoid connection conflicts
  return new PrismaClient({
    datasources: { 
      db: { 
        url: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL
      } 
    },
    log: ['error']
  });
}

async function resetDatabase() {
  console.log('⚠️ WARNING: RESETTING PRODUCTION DATABASE ⚠️');
  console.log('This will delete ALL data in the database.');
  
  let prisma = null;
  
  try {
    // Verify environment variables
    if (!process.env.POSTGRES_URL_NON_POOLING) {
      throw new Error('POSTGRES_URL_NON_POOLING environment variable is required for database reset');
    }
    
    // Create a fresh client using the non-pooling URL
    console.log('Connecting to database...');
    prisma = getFreshClient();
    
    await prisma.$connect();
    console.log('Connected to database ✓');
    
    // Drop all tables by running a raw SQL DROP SCHEMA command
    console.log('Attempting to drop all tables...');
    
    try {
      // Try individual table drops first for each model
      console.log('Dropping individual tables...');
      
      const tables = [
        'Enquiry',
        'User',
        'Holiday', 
        'TripPlan',
        '_prisma_migrations'
      ];
      
      for (const table of tables) {
        try {
          await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
          console.log(`Table "${table}" dropped`);
        } catch (err) {
          console.log(`Error dropping table "${table}": ${err.message}`);
        }
      }
      
      console.log('Tables dropped successfully ✓');
    } catch (dropError) {
      console.error('Error dropping tables:', dropError.message);
      console.log('Attempting alternative reset method...');
      
      try {
        // Alternative reset method: recreate the schema
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS public CASCADE;`);
        await prisma.$executeRawUnsafe(`CREATE SCHEMA public;`);
        console.log('Schema reset successful ✓');
      } catch (schemaError) {
        throw new Error(`Failed to reset database: ${schemaError.message}`);
      }
    }
    
    await prisma.$disconnect();
    prisma = null;
    
    // Now recreate everything using db push
    console.log('\nRegenerating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('\nPushing schema to database...');
    execSync('npx prisma db push --force-reset --accept-data-loss', { stdio: 'inherit' });
    
    // Finally, set up the initial data
    console.log('\nSetting up initial data...');
    await setupProductionDB();
    
    console.log('\n✅ Database reset and setup completed successfully');
    return true;
  } catch (error) {
    console.error('\n❌ Database reset failed:', error.message);
    console.error(error.stack);
    
    if (prisma) {
      await prisma.$disconnect().catch(() => {});
    }
    
    return false;
  }
}

// Run directly if this script is executed directly
if (require.main === module) {
  resetDatabase().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { resetDatabase }; 