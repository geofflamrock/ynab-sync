import type {
  BankAccount,
  BankCredential,
  Sync,
  YnabAccount,
  YnabCredential,
} from "@prisma/client";
import type { BankAccountFields, BankCredentialFields } from ".";
import { syncTransactions } from "ynab-sync-westpac-au";
import type { SyncOptions } from "api/sync";
import type { Logger, TransactionImportResults } from "ynab-sync-core";

type WestpacBankAccountDetails = {
  bsbNumber: string;
  accountNumber: string;
};

type WestpacCredentials = {
  username: string;
  password: string;
};

export function getWestpacBankAccountFields(
  bankAccount: BankAccount
): BankAccountFields {
  const details: WestpacBankAccountDetails = JSON.parse(bankAccount.details);
  return [
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
  ];
}

export function getWestpacBankCredentialFields(): BankCredentialFields {
  return [
    {
      name: "username",
      displayName: "Username",
    },
    {
      name: "password",
      displayName: "Password",
    },
  ];
}

export async function syncWestpacAccount(
  bankAccount: BankAccount,
  bankCredentials: BankCredential,
  ynabAccount: YnabAccount,
  ynabCredentials: YnabCredential,
  options: SyncOptions,
  logger: Logger
): Promise<TransactionImportResults> {
  const credentials: WestpacCredentials = JSON.parse(bankCredentials.details);

  return await syncTransactions(
    {
      options: {
        debug: options.debug,
        startDate: options.startDate,
        endDate: options.endDate,
        numberOfDaysToSync: 7,
      },
      westpacAccount: {
        accountName: bankAccount.name,
      },
      westpacCredentials: credentials,
      ynabAccount: {
        budgetId: ynabAccount.budgetId,
        accountId: ynabAccount.id,
      },
      ynabCredentials: {
        apiKey: ynabCredentials.apiKey,
      },
    },
    logger
  );
}
