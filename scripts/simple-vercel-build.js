/**
 * Simplified Vercel build script for Supabase deployment
 */
const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  const databaseUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ POSTGRES_PRISMA_URL or DATABASE_URL environment variable is missing');
    return false;
  }

  console.log('🔗 Using Supabase database:', databaseUrl.split('@')[1]?.split('/')[0] || 'Unknown host');

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    },
    log: ['error']
  });

  try {
    console.log('🔍 Testing Supabase connection...');
    await prisma.$connect();
    console.log('✅ Supabase connection successful');
    
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:');
    console.error(`Error: ${error.message}`);
    return false;
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      // Ignore disconnect errors
    }
  }
}

async function ensureAdminUser() {
  const databaseUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    },
    log: ['error']
  });

  try {
    console.log('👤 Ensuring admin user exists...');
    
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@skylimittravels.co.uk' }
    });

    if (existingUser) {
      console.log('✅ Admin user already exists');
      return true;
    }

    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@skylimittravels.co.uk',
        password: '$2a$10$CwTycUXWue0Thq9StjUM0uQxTmrjFPGa.Msf0FbE3EFZz5ZlIH2gK', // Admin123!
        role: 'ADMIN'
      }
    });

    console.log('✅ Admin user created successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to ensure admin user:');
    console.error(`Error: ${error.message}`);
    return false;
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      // Ignore disconnect errors
    }
  }
}

async function main() {
  console.log('🚀 Starting Supabase deployment setup...');
  
  // Test database connection
  const connectionSuccess = await testDatabaseConnection();
  if (!connectionSuccess) {
    console.error('❌ Build failed: Supabase connection unsuccessful');
    process.exit(1);
  }

  // Ensure admin user exists
  const adminSuccess = await ensureAdminUser();
  if (!adminSuccess) {
    console.log('⚠️ Warning: Admin user setup failed, but continuing build');
  }

  console.log('✅ Supabase setup completed successfully');
}

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Build script failed:', error);
    process.exit(1);
  });
}

module.exports = { testDatabaseConnection, ensureAdminUser }; 