const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Hash password with bcryptjs
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  try {
    // Update the admin user if exists, otherwise create
    const admin = await prisma.user.upsert({
      where: {
        email: 'admin@skylimittravels.co.uk',
      },
      update: {
        // Update password with new bcryptjs hash
        password: hashedPassword,
      },
      create: {
        name: 'Admin User',
        email: 'admin@skylimittravels.co.uk',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    
    console.log('Admin user created/updated successfully');
  } catch (error) {
    console.error('Error updating admin user:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 