import type {
  Account,
  BankAccount,
  BankCredential,
  Sync,
  YnabAccount,
  YnabBudget,
  YnabCredential,
} from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { syncTransactions as syncWestpacTransactions } from "ynab-sync-westpac-au";
import {
  AccountType,
  syncTransactions as syncStGeorgeTransactions,
} from "ynab-sync-st-george-au";
import type { SyncStatus } from "../app/api";

const prisma = new PrismaClient();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type SyncExtended = Sync & {
  account: Account & {
    bankAccount: BankAccount;
    bankCredentials: BankCredential;
    ynabCredentials: YnabCredential;
    ynabAccount: YnabAccount & { budget: YnabBudget };
  };
};

type WestpacCredentials = {
  username: string;
  password: string;
};

type StGeorgeCredentials = {
  accessNumber: string;
  securityNumber: number;
  password: string;
};

type WestpacBankAccountDetails = {
  bsbNumber: string;
  accountNumber: string;
};

type StGeorgeBankAccountDetails = {
  bsbNumber: string;
  accountNumber: string;
};

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
      await updateSyncAndAccountStatus(nextSync, "syncing");

      try {
        if (nextSync.account.bankAccount.type === "westpac") {
          await syncWestpacAccount(nextSync);
        } else if (nextSync.account.bankAccount.type === "stgeorge") {
          await syncStGeorgeAccount(nextSync);
        }

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

async function syncWestpacAccount(nextSync: SyncExtended) {
  const credentials: WestpacCredentials = JSON.parse(
    nextSync.account.bankCredentials.details
  );

  await syncWestpacTransactions({
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
}

async function syncStGeorgeAccount(nextSync: SyncExtended) {
  const credentials: StGeorgeCredentials = JSON.parse(
    nextSync.account.bankCredentials.details
  );

  const stGeorgeAccount: StGeorgeBankAccountDetails = JSON.parse(
    nextSync.account.bankAccount.details
  );

  await syncStGeorgeTransactions({
    options: {
      debug: true,
      numberOfDaysToSync: 7,
    },
    stGeorgeAccount: {
      accountNumber: stGeorgeAccount.accountNumber,
      accountType: AccountType.Debit,
      bsbNumber: stGeorgeAccount.bsbNumber,
    },
    stGeorgeCredentials: credentials,
    ynabAccount: {
      budgetId: nextSync.account.ynabAccount.budgetId,
      accountId: nextSync.account.ynabAccount.id,
    },
    ynabCredentials: {
      apiKey: nextSync.account.ynabCredentials.apiKey,
    },
  });
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
