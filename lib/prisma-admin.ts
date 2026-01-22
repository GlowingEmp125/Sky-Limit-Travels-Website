import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";

// Service role connection for admin operations
// This bypasses RLS policies when your app needs full database access
const createPrismaAdmin = () => {

  const isProduction = process.env.NODE_ENV === 'production'

  const adminUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL

  if (!adminUrl) {
    throw new Error('No database URL configured. Please set DATABASE_URL or POSTGRES_URL_NON_POOLING')
  }
  const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_PRISMA_URL });
  return new PrismaClient({ adapter });
}

// Regular connection for public operations (with RLS enabled)
const createPrismaPublic = () => {

  const isProduction = process.env.NODE_ENV === 'production'

  const publicUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL

  if (!publicUrl) {
    throw new Error('No database URL configured. Please set DATABASE_URL or POSTGRES_PRISMA_URL')
  }

  const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_PRISMA_URL });
  return new PrismaClient({ adapter });
}

// Global instances
const globalForPrisma = globalThis as unknown as {
  prismaAdmin: PrismaClient | undefined
  prismaPublic: PrismaClient | undefined
}

// Admin client for backend operations (bypasses RLS)
export const prismaAdmin = globalForPrisma.prismaAdmin ?? createPrismaAdmin()

// Public client for frontend operations (respects RLS)
export const prismaPublic = globalForPrisma.prismaPublic ?? createPrismaPublic()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaAdmin = prismaAdmin
  globalForPrisma.prismaPublic = prismaPublic
}

// Helper function to execute admin operations with service role
export async function executeAsAdmin<T>(
  operation: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  // Only set role for PostgreSQL (Supabase) databases
  const isPostgreSQL = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL

  if (isPostgreSQL) {
    // Set the role to service_role for this operation
    await prismaAdmin.$executeRaw`SET ROLE service_role;`
  }

  try {
    const result = await operation(prismaAdmin)
    return result
  } finally {
    if (isPostgreSQL) {
      // Reset the role
      await prismaAdmin.$executeRaw`RESET ROLE;`
    }
  }
}

// Helper function for public operations (with RLS)
export async function executeAsPublic<T>(
  operation: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  return await operation(prismaPublic)
} 