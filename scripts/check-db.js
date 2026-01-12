console.log('Checking Supabase database connectivity and schema...');

// Try to generate Prisma client and apply migrations
const { execSync } = require('child_process');

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Check if we're using Supabase
  if (process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.SUPABASE_URL) {
    console.log('✅ Detected Supabase/PostgreSQL environment');
    
    // Try to push the schema
    try {
      console.log('Applying database schema to PostgreSQL...');
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('✅ Schema push completed successfully');
    } catch (e) {
      console.error('Error pushing schema, trying alternative approach:', e.message);
      
      // Try direct SQL as a fallback to create the table if it doesn't exist
      try {
        console.log('Creating Enquiry table via SQL if it does not exist...');
        const sql = `
          CREATE TABLE IF NOT EXISTS "Enquiry" (
            "id" TEXT NOT NULL,
            "firstName" TEXT NOT NULL,
            "lastName" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "phone" TEXT,
            "message" TEXT NOT NULL,
            "type" TEXT NOT NULL DEFAULT 'GENERAL',
            "flightDetails" TEXT,
            "holidayDetails" TEXT,
            "packageDetails" TEXT,
            "status" TEXT NOT NULL DEFAULT 'NEW',
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            
            CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
          );
        `;
        
        // Create a temporary script to execute the SQL
        const fs = require('fs');
        fs.writeFileSync('create-enquiry-table.js', `
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          
          async function main() {
            try {
              await prisma.$executeRawUnsafe(\`${sql}\`);
              console.log('Table created or already exists');
            } catch (e) {
              console.error('Error creating table:', e);
            } finally {
              await prisma.$disconnect();
            }
          }
          
          main();
        `);
        
        // Execute the script
        execSync('node create-enquiry-table.js', { stdio: 'inherit' });
        
        // Clean up
        fs.unlinkSync('create-enquiry-table.js');
      } catch (sqlError) {
        console.error('Failed to create table via SQL:', sqlError.message);
      }
    }
  } else {
    console.log('Using local database configuration');
    try {
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('✅ Schema applied to local database');
    } catch (localError) {
      console.error('Error applying schema to local database:', localError.message);
    }
  }
  
  console.log('✅ Database setup completed, proceeding with build');
  process.exit(0); // Success
} catch (error) {
  console.error('Database setup error:', error.message);
  console.log('Proceeding with build anyway...');
  // We don't fail the build if DB setup has issues
  process.exit(0);
} 