/*
  Warnings:

  - You are about to drop the column `date` on the `Sync` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sync" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "details" TEXT NOT NULL DEFAULT '{}',
    "transactionsCreatedCount" INTEGER,
    "transactionsUpdatedCount" INTEGER,
    "transactionsUnchangedCount" INTEGER,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sync_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sync" ("accountId", "details", "id", "status", "transactionsCreatedCount", "transactionsUnchangedCount", "transactionsUpdatedCount") SELECT "accountId", "details", "id", "status", "transactionsCreatedCount", "transactionsUnchangedCount", "transactionsUpdatedCount" FROM "Sync";
DROP TABLE "Sync";
ALTER TABLE "new_Sync" RENAME TO "Sync";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
