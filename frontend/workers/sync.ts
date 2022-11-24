import type { Sync } from "@prisma/client";
import type { SyncStatus } from "../api";
import { getInProgressSyncs } from "../api";
import { getNextSync } from "../api";
import { prisma, syncBankAccountToYnab } from "../api";
import * as dotenv from "dotenv";
import { systemLogger, createTaskLogger } from "../logging";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function cancelInProgressSyncs() {
  systemLogger.info(
    "Checking if there are any in-progress syncs that need cancelling"
  );
  const inProgressSyncs = await getInProgressSyncs();

  for (const sync of inProgressSyncs) {
    systemLogger.info(`Marking sync ${sync.id} as error`);
    await updateSyncAndAccountStatus(sync, "error");
  }
}

async function pollAndSyncIfRequired() {
  await cancelInProgressSyncs();

  while (true) {
    systemLogger.verbose("Polling for next sync to process");
    const nextSync = await getNextSync();

    if (nextSync !== null) {
      systemLogger.info(
        `Found sync '${nextSync.id}' to process from ${nextSync.account.bankAccount.type} bank account '${nextSync.account.bankAccount.name}' to ynab account '${nextSync.account.ynabAccount.name}' in budget '${nextSync.account.ynabAccount.budget.name}'`
      );
      await updateSyncAndAccountStatus(nextSync, "syncing");

      try {
        await syncBankAccountToYnab(
          nextSync,
          nextSync.account.bankAccount,
          nextSync.account.bankCredentials,
          nextSync.account.ynabAccount,
          nextSync.account.ynabCredentials,
          createTaskLogger(`Sync-${nextSync.id}`)
        );

        await updateSyncAndAccountStatus(nextSync, "synced");
      } catch (error) {
        systemLogger.error(error);
        await updateSyncAndAccountStatus(nextSync, "error");
      }
    } else {
      systemLogger.verbose("No sync to process, sleeping for 5 seconds");
      await sleep(5000);
    }
  }
}

async function updateSyncAndAccountStatus(sync: Sync, status: SyncStatus) {
  await prisma.sync.update({
    where: {
      id: sync.id,
    },
    data: {
      status: status,
    },
  });
  await prisma.account.update({
    where: {
      id: sync.accountId,
    },
    data: {
      syncStatus: status,
      lastSyncTime: new Date(),
    },
  });
}

systemLogger.info("Starting sync worker");

// Load environment
dotenv.config();

pollAndSyncIfRequired()
  .catch((e) => {
    systemLogger.error(e);
    process.exit(1);
  })
  .finally(() => {
    systemLogger.info("Stopping sync worker");
    process.exit(0);
  });
