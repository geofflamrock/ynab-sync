/*
  Warnings:

  - Made the column `date` on table `Sync` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sync" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Sync_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sync" ("accountId", "date", "id", "status") SELECT "accountId", "date", "id", "status" FROM "Sync";
DROP TABLE "Sync";
ALTER TABLE "new_Sync" RENAME TO "Sync";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
