import { PrismaClient } from "@prisma/client";
import { syncTransactions } from "ynab-sync-westpac-au";
import type { WestpacCredentials } from "../app/api/api";

const prisma = new PrismaClient();

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
        `Found sync '${nextSync.id}' to process from bank account '${nextSync.account.bankAccountId}' to ynab account '${nextSync.account.ynabAccountId}'`
      );
      await prisma.sync.update({
        where: {
          id: nextSync.id,
        },
        data: {
          status: "syncing",
        },
      });
      await prisma.account.update({
        where: {
          id: nextSync.account.id,
        },
        data: {
          syncStatus: "syncing",
        },
      });

      if (nextSync.account.bankAccount.type === "westpac") {
        const credentials: WestpacCredentials = JSON.parse(
          nextSync.account.bankCredentials.details
        );

        try {
          await syncTransactions({
            options: {
              debug: true,
              numberOfDaysToSync: 7,
            },
            westpacAccount: {
              accountName: nextSync.account.bankAccount.name,
            },
            westpacCredentials: credentials,
            ynabAccount: {
              budgetId: nextSync.account.ynabAccount.budgetId,
              accountId: nextSync.account.ynabAccount.id,
            },
            ynabCredentials: {
              apiKey: nextSync.account.ynabCredentials.apiKey,
            },
          });
          await prisma.sync.update({
            where: {
              id: nextSync.id,
            },
            data: {
              status: "synced",
            },
          });
          await prisma.account.update({
            where: {
              id: nextSync.account.id,
            },
            data: {
              syncStatus: "synced",
            },
          });
        } catch (error) {
          await prisma.sync.update({
            where: {
              id: nextSync.id,
            },
            data: {
              status: "error",
            },
          });
          await prisma.account.update({
            where: {
              id: nextSync.account.id,
            },
            data: {
              syncStatus: "error",
            },
          });
        }
      }
    } else {
      console.log("No sync to process, sleeping for 5 seconds");
      await sleep(5000);
    }
  }
}

pollAndSyncIfRequired()
  .finally(() => process.exit(0))
  .catch(() => process.exit(1));
