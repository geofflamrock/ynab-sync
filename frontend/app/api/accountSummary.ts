import type { BankAccount } from "@prisma/client";
import type { SyncStatus } from "./sync";
import { getSyncStatus } from "./sync";
import type { StGeorgeBankAccountDetails } from "./banks/stgeorge";
import type { WestpacBankAccountDetails } from "./banks/westpac";
import { prisma } from "./client";

export type WestpacBankAccountSummary = {
  type: "westpac";
  accountName: string;
  bsbNumber: string;
  accountNumber: string;
};

export type StGeorgeBankAccountSummary = {
  type: "stgeorge";
  accountName: string;
  bsbNumber: string;
  accountNumber: string;
};

export type BankAccountSummary =
  | WestpacBankAccountSummary
  | StGeorgeBankAccountSummary;

export type YnabAccountSummary = {
  budgetId: string;
  budgetName: string;
  accountId: string;
  accountName: string;
};

export type AccountSummary = {
  id: number;
  bankAccount: BankAccountSummary;
  ynabAccount: YnabAccountSummary;
  status: SyncStatus;
  lastSyncTime?: Date;
};

function getBankAccountSummary(bankAccount: BankAccount): BankAccountSummary {
  switch (bankAccount.type) {
    case "westpac": {
      const details: WestpacBankAccountDetails = JSON.parse(
        bankAccount.details
      );
      return {
        type: "westpac",
        accountName: bankAccount.name,
        accountNumber: details.accountNumber,
        bsbNumber: details.bsbNumber,
      };
    }

    case "stgeorge": {
      const details: StGeorgeBankAccountDetails = JSON.parse(
        bankAccount.details
      );
      return {
        type: "stgeorge",
        accountName: bankAccount.name,
        accountNumber: details.accountNumber,
        bsbNumber: details.bsbNumber,
      };
    }

    default:
      throw new Error(`Unknown bank account type ${bankAccount.type}`);
  }
}

export const getAccountSummaries = async (): Promise<Array<AccountSummary>> => {
  const accounts = await prisma.account.findMany({
    include: {
      bankAccount: true,
      ynabAccount: {
        include: {
          budget: true,
        },
      },
    },
  });

  return accounts.map<AccountSummary>((account) => {
    return {
      id: account.id,
      bankAccount: getBankAccountSummary(account.bankAccount),
      ynabAccount: {
        accountId: account.ynabAccount.id,
        accountName: account.ynabAccount.name,
        budgetId: account.ynabAccount.budget.id,
        budgetName: account.ynabAccount.budget.name,
      },
      status: getSyncStatus(account.syncStatus),
      lastSyncTime:
        account.lastSyncTime === null ? undefined : account.lastSyncTime,
    };
  });
};
