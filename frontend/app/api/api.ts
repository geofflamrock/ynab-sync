import type {
  Account,
  BankAccount,
  Sync,
  YnabAccount,
  YnabBudget,
  YnabCredential,
} from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { sub } from "date-fns";
import { orderBy } from "lodash";
import { syncTransactions } from "ynab-sync-westpac-au";

export type WestpacSyncDetail = {
  type: "westpac";
  accountName: string;
  bsbNumber: string;
  accountNumber: string;
};

export type StGeorgeSyncDetail = {
  type: "stgeorge";
  accountName: string;
  bsbNumber: string;
  accountNumber: string;
};

export type SupportedBanks = WestpacSyncDetail | StGeorgeSyncDetail;

export type SyncYnabDetail = {
  budgetId: string;
  budgetName: string;
  accountId: string;
  accountName: string;
};

export type SyncStatus =
  | "notsynced"
  | "queued"
  | "syncing"
  | "synced"
  | "error";

export type SyncDetail = {
  id: number;
  status: SyncStatus;
  date: Date;
  newRecordsCount: number;
  updatedRecordsCount: number;
  unchangedRecordsCount: number;
};

export type AccountDetail = {
  id: number;
  bank: SupportedBanks;
  ynab: SyncYnabDetail;
  status: SyncStatus;
  lastSyncTime?: Date;
  history: Array<SyncDetail>;
};

export const prisma = new PrismaClient();

export const getAccountDetail = async (
  id: number
): Promise<AccountDetail | undefined> => {
  const account = await prisma.account.findUnique({
    where: {
      id: id,
    },
    include: {
      bankAccount: true,
      ynabAccount: {
        include: {
          budget: true,
        },
      },
      history: {
        orderBy: {
          date: "desc",
        },
        skip: 0,
        take: 10,
      },
    },
  });

  if (account === null) return undefined;

  return getAccountDetailFromAccount(account);
};

type WestpacBankAccountDetails = {
  bsbNumber: string;
  accountNumber: string;
};

type StGeorgeBankAccountDetails = {
  bsbNumber: string;
  accountNumber: string;
};

const getAccountDetailFromAccount = (
  account: Account & {
    bankAccount: BankAccount;
    ynabAccount: YnabAccount & {
      budget: YnabBudget;
    };
    history: Sync[];
  }
): AccountDetail => {
  let bankAccount: SupportedBanks | undefined = undefined;

  if (account.bankAccount.type === "westpac") {
    const details: WestpacBankAccountDetails = JSON.parse(
      account.bankAccount.details
    );
    bankAccount = {
      type: "westpac",
      accountName: account.bankAccount.name,
      accountNumber: details.accountNumber,
      bsbNumber: details.bsbNumber,
    };
  } else if (account.bankAccount.type === "stgeorge") {
    const details: StGeorgeBankAccountDetails = JSON.parse(
      account.bankAccount.details
    );
    bankAccount = {
      type: "stgeorge",
      accountName: account.bankAccount.name,
      accountNumber: details.accountNumber,
      bsbNumber: details.bsbNumber,
    };
  }

  if (bankAccount === undefined)
    throw new Error(`Unknown bank account type '${account.bankAccount.type}'`);

  let ynabAccount: SyncYnabDetail = {
    accountId: account.ynabAccount.id,
    accountName: account.ynabAccount.name,
    budgetId: account.ynabAccount.budgetId,
    budgetName: account.ynabAccount.budget.name,
  };

  return {
    id: account.id,
    bank: bankAccount,
    ynab: ynabAccount,
    history: orderBy(account.history, ["date"], ["desc"]).map<SyncDetail>(
      (h) => {
        return {
          date: h.date,
          id: h.id,
          status: getSyncStatus(h.status),
          newRecordsCount: 0,
          unchangedRecordsCount: 0,
          updatedRecordsCount: 0,
        };
      }
    ),
    lastSyncTime:
      account.lastSyncTime === null ? undefined : account.lastSyncTime,
    status: getSyncStatus(account.syncStatus),
  };
};

const getSyncStatus = (status: string): SyncStatus => {
  switch (status) {
    case "notsynced":
      return "notsynced";
    case "syncing":
      return "syncing";
    case "queued":
      return "queued";
    case "error":
      return "error";
    case "synced":
      return "synced";
    default:
      return "notsynced";
  }
};

export const getSyncDetails = async (): Promise<Array<AccountDetail>> => {
  const accounts = await prisma.account.findMany({
    include: {
      bankAccount: true,
      ynabAccount: {
        include: {
          budget: true,
        },
      },
      history: true,
    },
  });

  return accounts.map<AccountDetail>((account) =>
    getAccountDetailFromAccount(account)
  );
};

export const syncNow = async (id: number) => {
  const account = await prisma.account.findUnique({
    where: {
      id: id,
    },
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
  });

  if (account === null) throw new Error("Could not find account details");

  await prisma.sync.create({
    data: {
      accountId: account.id,
      status: "queued",
      date: new Date(),
    },
  });

  // if (account.bankAccount.type === "westpac") {
  //   const credentials: WestpacCredentials = JSON.parse(
  //     account.bankCredentials.details
  //   );

  //   await syncWestpacAccount(
  //     account.id,
  //     account.bankAccount.name,
  //     credentials,
  //     account.ynabCredentials,
  //     account.ynabAccount
  //   );
  // } else {
  //   throw new Error(`Unknown bank account type '${account.bankAccount.type}'`);
  // }
};

export type WestpacCredentials = {
  username: string;
  password: string;
};

// todo: Don't use the prisma types
async function syncWestpacAccount(
  accountId: number,
  accountName: string,
  westpacCredentials: WestpacCredentials,
  ynabCredentials: YnabCredential,
  ynabAccount: YnabAccount
) {
  const syncHistory = await prisma.sync.create({
    data: {
      accountId,
      status: "syncing",
      date: new Date(),
    },
  });

  try {
    await syncTransactions({
      options: {
        debug: true,
        numberOfDaysToSync: 7,
      },
      westpacAccount: {
        accountName: accountName,
      },
      westpacCredentials,
      ynabAccount: {
        budgetId: ynabAccount.budgetId,
        accountId: ynabAccount.id,
      },
      ynabCredentials: {
        apiKey: ynabCredentials.apiKey,
      },
    });
    await prisma.sync.update({
      where: {
        id: syncHistory.id,
      },
      data: {
        status: "synced",
      },
    });
    await prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        syncStatus: "synced",
      },
    });
  } catch (error) {
    await prisma.sync.update({
      where: {
        id: syncHistory.id,
      },
      data: {
        status: "error",
      },
    });
    await prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        syncStatus: "error",
      },
    });
  }
}
