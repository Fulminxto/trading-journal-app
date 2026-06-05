import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Always persist to globalThis — without this, production builds create a new
// PrismaClient per module evaluation and exhaust the PgBouncer connection_limit=1.
globalForPrisma.prisma = prisma;
