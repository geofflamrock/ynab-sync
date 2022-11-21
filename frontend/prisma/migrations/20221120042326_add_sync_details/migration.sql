-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bankCredentialId" INTEGER NOT NULL,
    "bankAccountId" INTEGER NOT NULL,
    "ynabCredentialId" INTEGER NOT NULL,
    "ynabAccountId" TEXT NOT NULL,
    "syncStatus" TEXT NOT NULL DEFAULT 'notsynced',
    "lastSyncTime" DATETIME,
    CONSTRAINT "Account_bankCredentialId_fkey" FOREIGN KEY ("bankCredentialId") REFERENCES "BankCredential" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Account_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Account_ynabCredentialId_fkey" FOREIGN KEY ("ynabCredentialId") REFERENCES "YnabCredential" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Account_ynabAccountId_fkey" FOREIGN KEY ("ynabAccountId") REFERENCES "YnabAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Account" ("bankAccountId", "bankCredentialId", "id", "lastSyncTime", "syncStatus", "ynabAccountId", "ynabCredentialId") SELECT "bankAccountId", "bankCredentialId", "id", "lastSyncTime", "syncStatus", "ynabAccountId", "ynabCredentialId" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE TABLE "new_Sync" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "details" TEXT NOT NULL DEFAULT '{}',
    CONSTRAINT "Sync_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sync" ("accountId", "date", "id", "status") SELECT "accountId", "date", "id", "status" FROM "Sync";
DROP TABLE "Sync";
ALTER TABLE "new_Sync" RENAME TO "Sync";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
