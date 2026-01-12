// Database connection test script for Vercel
const { PrismaClient } = require('@prisma/client');

// Display environment info
const logEnvironmentInfo = () => {
  console.log('=== Environment Information ===');
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Vercel Env: ${process.env.VERCEL_ENV || 'Not on Vercel'}`);
  
  // Check database URLs (safely - don't log credentials)
  const dbUrlsPresent = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
  };
  
  console.log('\n=== Database Environment Variables ===');
  Object.entries(dbUrlsPresent).forEach(([key, exists]) => {
    console.log(`${key}: ${exists ? 'Present' : 'Missing'}`);
    
    if (exists) {
      try {
        const url = new URL(process.env[key]);
        console.log(`  - Protocol: ${url.protocol}`);
        console.log(`  - Host: ${url.host}`);
        console.log(`  - Has Username: ${!!url.username}`);
        console.log(`  - Has Password: ${!!url.password}`);
        console.log(`  - Path: ${url.pathname}`);
      } catch (error) {
        console.log(`  - Invalid URL format: ${error.message}`);
      }
    }
  });
};

// Get a fresh client for each operation
function getFreshClient() {
  // Using the non-pooling URL helps avoid connection conflicts
  const connectionUrl = process.env.POSTGRES_URL_NON_POOLING || 
                       process.env.POSTGRES_PRISMA_URL || 
                       process.env.DATABASE_URL;
                       
  return new PrismaClient({
    datasources: { db: { url: connectionUrl } },
    // Set up minimal logging to avoid additional overhead
    log: ['error']
  });
}

// Simple test to check if database connection works
async function simpleDatabaseTest() {
  const prisma = getFreshClient();
  
  try {
    await prisma.$connect();
    console.log('Successfully connected to database! ✓');
    
    // Don't use raw queries - use a simple model operation instead
    try {
      // Try a simple model operation that won't fail even if table doesn't exist
      const userCount = await prisma.user.count();
      console.log(`Successfully queried users table. Found ${userCount} users.`);
      return true;
    } catch (queryError) {
      if (queryError.code === 'P2010' || queryError.message.includes('prepared statement')) {
        console.log('Got prepared statement error, but connection is working');
        return true;
      }
      
      if (queryError.code === 'P2021') {
        console.log('Table does not exist yet, but connection is working');
        return true;
      }
      
      console.error('Error during test query:', queryError.message);
      return false;
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('\n=== DATABASE CONNECTION ERROR ===');
    console.error(`Error type: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    console.error(`Error code: ${error.code || 'unknown'}`);
    
    return false;
  }
}

// Test connecting to the database
const testConnection = async () => {
  try {
    console.log('\n=== Testing Database Connection ===');
    
    // Log the environment first
    logEnvironmentInfo();
    
    // Run a simple connection test
    const success = await simpleDatabaseTest();
    
    return success;
  } catch (error) {
    console.error('\n=== DATABASE CONNECTION ERROR ===');
    console.error(`Error type: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    
    if (error.meta) {
      console.error('Error metadata:', error.meta);
    }
    
    console.error('\nStack trace:');
    console.error(error.stack);
    
    return false;
  }
};

// Run the test if this script is executed directly
if (require.main === module) {
  console.log('Running database connection test...');
  testConnection().then(success => {
    if (success) {
      console.log('\n✓ Database connection test passed!');
      process.exit(0);
    } else {
      console.error('\n✗ Database connection test failed!');
      process.exit(1);
    }
  }).catch(err => {
    console.error('Unexpected error during test:', err);
    process.exit(1);
  });
}

module.exports = { testConnection }; 