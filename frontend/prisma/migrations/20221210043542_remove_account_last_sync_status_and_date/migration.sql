/*
  Warnings:

  - You are about to drop the column `lastSyncTime` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `syncStatus` on the `Account` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bankCredentialId" INTEGER NOT NULL,
    "bankAccountId" INTEGER NOT NULL,
    "ynabCredentialId" INTEGER NOT NULL,
    "ynabAccountId" TEXT NOT NULL,
    CONSTRAINT "Account_bankCredentialId_fkey" FOREIGN KEY ("bankCredentialId") REFERENCES "BankCredential" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Account_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Account_ynabCredentialId_fkey" FOREIGN KEY ("ynabCredentialId") REFERENCES "YnabCredential" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Account_ynabAccountId_fkey" FOREIGN KEY ("ynabAccountId") REFERENCES "YnabAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Account" ("bankAccountId", "bankCredentialId", "id", "ynabAccountId", "ynabCredentialId") SELECT "bankAccountId", "bankCredentialId", "id", "ynabAccountId", "ynabCredentialId" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
