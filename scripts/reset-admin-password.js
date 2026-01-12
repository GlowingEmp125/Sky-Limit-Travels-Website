/**
 * Script to reset the admin password
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
  console.log('Resetting admin password...');
  
  const password = 'Admin123!'; // Default admin password
  const email = 'admin@skylimittravels.co.uk';
  
  // Generate a fresh bcrypt hash
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Generated hash:', hashedPassword);
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL
      }
    }
  });
  
  try {
    await prisma.$connect();
    console.log('Connected to database');
    
    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (adminUser) {
      // Update existing admin
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      });
      console.log(`Updated password for user: ${email}`);
    } else {
      // Create admin if doesn't exist
      await prisma.user.create({
        data: {
          name: 'Admin',
          email,
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      console.log(`Created new admin user: ${email}`);
    }
    
    console.log('Admin password reset successfully!');
    console.log('Login with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run directly
if (require.main === module) {
  resetAdminPassword()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { resetAdminPassword }; 