import path from "node:path";

import Database from "better-sqlite3";

let initializationPromise: Promise<void> | null = null;

function resolveDatabasePath() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl?.startsWith("file:")) {
    throw new Error('DATABASE_URL must use a local SQLite file path such as "file:./dev.db".');
  }

  const relativePath = databaseUrl.slice("file:".length);
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), relativePath);
}

async function initializeDatabase() {
  const databasePath = resolveDatabasePath();
  const database = new Database(databasePath);

  database.exec(`
    CREATE TABLE IF NOT EXISTS "Crop" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "nameNormalized" TEXT NOT NULL,
      "purchasePrice" REAL NOT NULL,
      "yieldQuantity" REAL NOT NULL,
      "experienceGain" REAL NOT NULL,
      "saleTotalPrice" REAL NOT NULL,
      "maturityValue" REAL NOT NULL,
      "maturityUnit" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "Crop_nameNormalized_key"
    ON "Crop"("nameNormalized");
  `);

  database.close();
}

export async function ensureDatabase() {
  if (!initializationPromise) {
    initializationPromise = initializeDatabase();
  }

  await initializationPromise;
}
