import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl?.startsWith("file:")) {
    throw new Error('DATABASE_URL must use a local SQLite file path such as "file:./dev.db".');
  }

  return databaseUrl;
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: getDatabaseUrl(),
    }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
