import type { BankAccount } from "@prisma/client";
import type { SyncStatus } from "../sync";
import { getSyncStatus } from "../sync";
import { prisma } from "../client";
import type { BankAccountFields } from "../banks";
import type { SupportedBankTypes } from "../banks";
import { getBankType } from "../banks";
import { getBankAccountFields } from "../banks";

export type BankAccountSummary = {
  type: SupportedBankTypes;
  name: string;
  fields: BankAccountFields;
};

export type YnabAccountSummary = {
  budgetName: string;
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
  const bankType = getBankType(bankAccount.type);

  return {
    type: bankType,
    name: bankAccount.name,
    fields: getBankAccountFields(bankAccount),
  };
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
        accountName: account.ynabAccount.name,
        budgetName: account.ynabAccount.budget.name,
      },
      status: getSyncStatus(account.syncStatus),
      lastSyncTime:
        account.lastSyncTime === null ? undefined : account.lastSyncTime,
    };
  });
};
