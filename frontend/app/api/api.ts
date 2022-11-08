import type {
  Account,
  BankAccount,
  Sync,
  YnabAccount,
  YnabBudget,
} from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { orderBy } from "lodash";

export type WestpacSyncDetail = {
  type: "westpac";
  accountName: string;
  bsbNumber: string;
  accountNumber: string;
  credentialsId: number;
  credentialsName: string;
};

export type StGeorgeSyncDetail = {
  type: "stgeorge";
  accountName: string;
  bsbNumber: string;
  accountNumber: string;
  credentialsId: number;
  credentialsName: string;
};

export type BankDetails = WestpacSyncDetail | StGeorgeSyncDetail;

export type YnabDetails = {
  budgetId: string;
  budgetName: string;
  accountId: string;
  accountName: string;
  credentialsId: number;
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
  bank: BankDetails;
  ynab: YnabDetails;
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
      bankCredentials: {
        select: {
          id: true,
          name: true,
        },
      },
      ynabAccount: {
        include: {
          budget: true,
        },
      },
      ynabCredentials: {
        select: {
          id: true,
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
    bankCredentials: {
      id: number;
      name: string;
    };
    ynabAccount: YnabAccount & {
      budget: YnabBudget;
    };
    ynabCredentials: {
      id: number;
    };
    history: Sync[];
  }
): AccountDetail => {
  let bankAccount: BankDetails | undefined = undefined;

  if (account.bankAccount.type === "westpac") {
    const details: WestpacBankAccountDetails = JSON.parse(
      account.bankAccount.details
    );

    bankAccount = {
      type: "westpac",
      accountName: account.bankAccount.name,
      accountNumber: details.accountNumber,
      bsbNumber: details.bsbNumber,
      credentialsId: account.bankCredentials.id,
      credentialsName: account.bankCredentials.name,
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
      credentialsId: account.bankCredentials.id,
      credentialsName: account.bankCredentials.name,
    };
  }

  if (bankAccount === undefined)
    throw new Error(`Unknown bank account type '${account.bankAccount.type}'`);

  let ynabAccount: YnabDetails = {
    accountId: account.ynabAccount.id,
    accountName: account.ynabAccount.name,
    budgetId: account.ynabAccount.budgetId,
    budgetName: account.ynabAccount.budget.name,
    credentialsId: account.ynabCredentials.id,
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
      bankCredentials: {
        select: {
          id: true,
          name: true,
        },
      },
      ynabAccount: {
        include: {
          budget: true,
        },
      },
      ynabCredentials: {
        select: {
          id: true,
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

  await prisma.account.update({
    where: {
      id: account.id,
    },
    data: {
      syncStatus: "queued",
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
