/**
 * Helper functions for safely managing Prisma connections on Vercel
 */

const { PrismaClient } = require('@prisma/client');

/**
 * Creates a fresh Prisma client and executes a function with it
 * This helps avoid the "prepared statement already exists" errors
 * by ensuring each operation uses a separate connection
 */
async function withPrisma(operation) {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    return await operation(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Safely executes a raw SQL query and handles the connection properly
 */
async function execRawQuery(queryString, params = []) {
  return withPrisma(async (prisma) => {
    return await prisma.$queryRawUnsafe(queryString, ...params);
  });
}

/**
 * Checks if a specific table exists in the database
 */
async function tableExists(tableName) {
  const results = await execRawQuery(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = $1
    )
  `, [tableName]);
  
  return results[0].exists;
}

/**
 * Gets a list of all tables in the public schema
 */
async function listTables() {
  return execRawQuery(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);
}

module.exports = {
  withPrisma,
  execRawQuery,
  tableExists,
  listTables
}; 