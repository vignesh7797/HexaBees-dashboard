import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
  };
  
  // Prevent hot-reload from creating new instances
  export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: ['query'], // Optional: log SQL queries in the console
    });
  
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;