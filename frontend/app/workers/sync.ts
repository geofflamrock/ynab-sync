import type { Sync } from "@prisma/client";
import type { SyncStatus } from "../api";
import { prisma, syncBankAccountToYnab } from "../api";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function pollAndSyncIfRequired() {
  while (true) {
    console.log("Polling for next sync to process");
    const nextSync = await prisma.sync.findFirst({
      where: {
        status: "queued",
      },
      orderBy: {
        date: "asc",
      },
      include: {
        account: {
          include: {
            bankAccount: true,
            bankCredentials: true,
            ynabAccount: {
              include: {
                budget: true,
              },
            },
            ynabCredentials: true,
          },
        },
      },
    });

    if (nextSync !== null) {
      console.log(
        `Found sync '${nextSync.id}' to process from ${nextSync.account.bankAccount.type} bank account '${nextSync.account.bankAccount.name}' to ynab account '${nextSync.account.ynabAccount.name}' in budget '${nextSync.account.ynabAccount.budget.name}'`
      );
      await updateSyncAndAccountStatus(nextSync, "syncing");

      try {
        await syncBankAccountToYnab(
          nextSync.account.bankAccount,
          nextSync.account.bankCredentials,
          nextSync.account.ynabAccount,
          nextSync.account.ynabCredentials
        );

        await updateSyncAndAccountStatus(nextSync, "synced");
      } catch (error) {
        console.log(error);
        await updateSyncAndAccountStatus(nextSync, "error");
      }
    } else {
      console.log("No sync to process, sleeping for 5 seconds");
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
      lastSyncTime: sync.date,
    },
  });
}

pollAndSyncIfRequired()
  .finally(() => process.exit(0))
  .catch(() => process.exit(1));
