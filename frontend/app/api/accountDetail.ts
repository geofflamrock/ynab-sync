import type {
  Account,
  BankAccount,
  YnabAccount,
  YnabBudget,
  Sync,
  BankCredential,
  YnabCredential,
} from "@prisma/client";
import type { StGeorgeBankAccountDetails } from "./banks/stgeorge";
import type { WestpacBankAccountDetails } from "./banks/westpac";
import { prisma } from "./client";
import type { SyncStatus } from "./sync";
import { getSyncStatus } from "./sync";
import { orderBy } from "lodash";

type BankCredentialField = {
  name: string;
  displayName: string;
};

export type BankAccountField = {
  name: string;
  displayName: string;
  value: string;
};

type BankCredentialDetail = {
  id: number;
  name: string;
  fields: Array<BankCredentialField>;
};

export type WestpacAccountDetail = {
  type: "westpac";
  name: string;
  fields: Array<BankAccountField>;
  credentials: BankCredentialDetail;
};

export type StGeorgeAccountDetail = {
  type: "stgeorge";
  name: string;
  fields: Array<BankAccountField>;
  credentials: BankCredentialDetail;
};

export type BankAccountDetail = WestpacAccountDetail | StGeorgeAccountDetail;

export type YnabAccountDetail = {
  budgetId: string;
  budgetName: string;
  accountId: string;
  accountName: string;
  credentialsId: number;
};

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
  bank: BankAccountDetail;
  ynab: YnabAccountDetail;
  status: SyncStatus;
  lastSyncTime?: Date;
  history: Array<SyncDetail>;
};

export const getAccountDetail = async (
  id: number
): Promise<AccountDetail | undefined> => {
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

const getAccountDetailFromAccount = (
  account: Account & {
    bankAccount: BankAccount;
    bankCredentials: BankCredential;
    ynabAccount: YnabAccount & {
      budget: YnabBudget;
    };
    ynabCredentials: YnabCredential;
    history: Sync[];
  }
): AccountDetail => {
  let bankAccount: BankAccountDetail | undefined = undefined;

  if (account.bankAccount.type === "westpac") {
    const details: WestpacBankAccountDetails = JSON.parse(
      account.bankAccount.details
    );

    bankAccount = {
      type: "westpac",
      name: account.bankAccount.name,
      fields: [
        {
          name: "bsbNumber",
          displayName: "BSB Number",
          value: details.bsbNumber,
        },
        {
          name: "accountNumber",
          displayName: "Account Number",
          value: details.accountNumber,
        },
      ],
      credentials: {
        id: account.bankCredentials.id,
        name: account.bankCredentials.name,
        fields: [
          {
            name: "username",
            displayName: "Username",
          },
          {
            name: "password",
            displayName: "Password",
          },
        ],
      },
    };
  } else if (account.bankAccount.type === "stgeorge") {
    const details: StGeorgeBankAccountDetails = JSON.parse(
      account.bankAccount.details
    );
    bankAccount = {
      type: "stgeorge",
      name: account.bankAccount.name,
      fields: [
        {
          name: "bsbNumber",
          displayName: "BSB Number",
          value: details.bsbNumber,
        },
        {
          name: "accountNumber",
          displayName: "Account Number",
          value: details.accountNumber,
        },
      ],
      credentials: {
        id: account.bankCredentials.id,
        name: account.bankCredentials.name,
        fields: [
          {
            name: "accessNumber",
            displayName: "Access Number",
          },
          {
            name: "securityNumber",
            displayName: "Security Number",
          },
          {
            name: "password",
            displayName: "Password",
          },
        ],
      },
    };
  }

  if (bankAccount === undefined)
    throw new Error(`Unknown bank account type '${account.bankAccount.type}'`);

  let ynabAccount: YnabAccountDetail = {
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
      (h: Sync) => {
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
