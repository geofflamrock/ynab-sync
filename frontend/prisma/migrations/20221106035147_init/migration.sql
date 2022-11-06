-- CreateTable
CREATE TABLE "BankAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "details" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BankCredential" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "details" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "YnabBudget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "YnabAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "budgetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "YnabAccount_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "YnabBudget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "YnabCredential" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apiKey" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bankCredentialId" INTEGER NOT NULL,
    "bankAccountId" INTEGER NOT NULL,
    "ynabCredentialId" INTEGER NOT NULL,
    "ynabAccountId" TEXT NOT NULL,
    "syncStatus" TEXT NOT NULL,
    "lastSyncTime" DATETIME,
    CONSTRAINT "Account_bankCredentialId_fkey" FOREIGN KEY ("bankCredentialId") REFERENCES "BankCredential" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Account_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Account_ynabCredentialId_fkey" FOREIGN KEY ("ynabCredentialId") REFERENCES "YnabCredential" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Account_ynabAccountId_fkey" FOREIGN KEY ("ynabAccountId") REFERENCES "YnabAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sync" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" INTEGER NOT NULL,
    "date" DATETIME,
    "status" TEXT NOT NULL,
    CONSTRAINT "Sync_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
