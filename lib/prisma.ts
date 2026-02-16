// import { PrismaClient } from '@prisma/client';

// // PrismaClient is attached to the `global` object in development to prevent
// // exhausting your database connection limit.
// // Learn more: https://pris.ly/d/help/next-js-best-practices

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// };

// // Create a client with options
// const createPrismaClient = () => {
//   console.log('Creating Prisma client...');

//   // Create the client with logging options
//   const client = new PrismaClient({
//     datasources: {
//       db: {
//         url: process.env.NODE_ENV === 'production' 
//           ? process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL
//           : process.env.DATABASE_URL || 'file:./dev.db'
//       }
//     },
//     log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
//   });

//   // Add middleware for logging
//   client.$use(async (params, next) => {
//     const before = Date.now();
//     try {
//       const result = await next(params);
//       const after = Date.now();
//       if (process.env.NODE_ENV === 'development') {
//         console.log(`Prisma query ${params.model}.${params.action} took ${after - before}ms`);
//       }
//       return result;
//     } catch (error) {
//       const after = Date.now();
//       console.error(`Prisma query ${params.model}.${params.action} failed after ${after - before}ms`);
//       console.error('Query error:', error);
//       throw error;
//     }
//   });

//   console.log('Prisma client created successfully');
//   return client;
// };

// // Create a function that ensures database connection
// export const connectPrisma = async () => {
//   try {
//     await prisma.$connect();
//     console.log('Database connection established successfully');
//     return true;
//   } catch (error) {
//     console.error('Database connection failed:', error);
//     return false;
//   }
// };

// // Use existing client or create a new one
// export const prisma =
//   globalForPrisma.prisma ??
//   createPrismaClient();

// // Save the client in global for reuse
// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// export default prisma; 

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_PRISMA_URL });

// const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     datasources: {
//       db: {
//         url: process.env.POSTGRES_PRISMA_URL, // Prisma 6 supports string here
//       },
//     },
//     log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
//   });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export default prisma;

const prisma = new PrismaClient({ adapter });

export default prisma;
