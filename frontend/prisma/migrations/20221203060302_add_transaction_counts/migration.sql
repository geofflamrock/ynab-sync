-- AlterTable
ALTER TABLE "Sync" ADD COLUMN "transactionsCreatedCount" INTEGER;
ALTER TABLE "Sync" ADD COLUMN "transactionsUnchangedCount" INTEGER;
ALTER TABLE "Sync" ADD COLUMN "transactionsUpdatedCount" INTEGER;
