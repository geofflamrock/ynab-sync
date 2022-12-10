import { updateSuccessfulSync, updateSync } from "../api";
import { getInProgressSyncs } from "../api";
import { getNextSync } from "../api";
import { syncBankAccountToYnab } from "../api";
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
    const taskLog = createSyncTaskLogger(sync.id);
    taskLog.error(
      "Sync was in progress when application started, marking sync as error"
    );
    await updateSync(sync.id, "error");
  }
}

function createSyncTaskLogger(syncId: number) {
  return createTaskLogger(`Sync-${syncId}`);
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
      await updateSync(nextSync.id, "syncing");

      try {
        const importResults = await syncBankAccountToYnab(
          nextSync,
          nextSync.account.bankAccount,
          nextSync.account.bankCredentials,
          nextSync.account.ynabAccount,
          nextSync.account.ynabCredentials,
          createSyncTaskLogger(nextSync.id)
        );

        await updateSuccessfulSync(nextSync.id, importResults);
      } catch (error) {
        systemLogger.error("An error has occurred syncing", error);
        await updateSync(nextSync.id, "error");
      }
    } else {
      systemLogger.verbose("No sync to process, sleeping for 5 seconds");
      await sleep(5000);
    }
  }
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
