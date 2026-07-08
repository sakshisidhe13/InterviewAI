// FILE: lib/prisma.js
// Singleton Prisma client — prevents exhausting DB connections in development
// (Next.js hot-reload and nodemon re-require modules, which would create a new
//  PrismaClient on every reload without this guard.)

const { PrismaClient } = require("@prisma/client");

const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;