import type { BankAccount, Sync, BankCredential } from "@prisma/client";
import { prisma } from "./client";
import type { SyncStatus } from "./sync";
import { getSyncStatus } from "./sync";
import { orderBy } from "lodash";
import type {
  BankCredentialFields,
  SupportedBankTypes,
  BankAccountFields,
} from "./banks";
import { getBankType } from "./banks";
import { getBankAccountFields } from "./banks";
import { getBankCredentialFields } from "./banks";

type BankCredentialDetail = {
  id: number;
  name: string;
  fields: BankCredentialFields;
};

export type BankAccountDetail = {
  type: SupportedBankTypes;
  name: string;
  fields: BankAccountFields;
  credentials: BankCredentialDetail;
};

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

  return {
    id: account.id,
    bank: getBankAccountDetail(account.bankAccount, account.bankCredentials),
    ynab: {
      accountId: account.ynabAccount.id,
      accountName: account.ynabAccount.name,
      budgetId: account.ynabAccount.budgetId,
      budgetName: account.ynabAccount.budget.name,
      credentialsId: account.ynabCredentials.id,
    },
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

function getBankAccountDetail(
  bankAccount: BankAccount,
  bankCredentials: BankCredential
): BankAccountDetail {
  const bankType = getBankType(bankAccount.type);

  return {
    type: bankType,
    name: bankAccount.name,
    fields: getBankAccountFields(bankAccount),
    credentials: {
      id: bankCredentials.id,
      name: bankCredentials.name,
      fields: getBankCredentialFields(bankType),
    },
  };
}
