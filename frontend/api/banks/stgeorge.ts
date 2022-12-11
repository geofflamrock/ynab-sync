import type {
  BankAccount,
  BankCredential,
  YnabAccount,
  YnabCredential,
} from "@prisma/client";
import type { SyncOptions } from "api/sync";
import { AccountType, syncTransactions } from "ynab-sync-st-george-au";
import type { BankAccountFields, BankCredentialFields } from ".";
import type { Logger, TransactionImportResults } from "ynab-sync-core";

type StGeorgeBankAccountDetails = {
  bsbNumber: string;
  accountNumber: string;
};

type StGeorgeCredentials = {
  accessNumber: string;
  securityNumber: number;
  password: string;
};

export function getStGeorgeBankAccountFields(
  bankAccount: BankAccount
): BankAccountFields {
  const details: StGeorgeBankAccountDetails = JSON.parse(bankAccount.details);
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

export function getStGeorgeBankCredentialFields(): BankCredentialFields {
  return [
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
  ];
}

export async function syncStGeorgeAccount(
  bankAccount: BankAccount,
  bankCredentials: BankCredential,
  ynabAccount: YnabAccount,
  ynabCredentials: YnabCredential,
  options: SyncOptions,
  logger: Logger
): Promise<TransactionImportResults> {
  const credentials: StGeorgeCredentials = JSON.parse(bankCredentials.details);

  const stGeorgeAccount: StGeorgeBankAccountDetails = JSON.parse(
    bankAccount.details
  );

  return await syncTransactions(
    {
      options: {
        debug: options.debug,
        numberOfDaysToSync: 7,
        startDate: options.startDate,
        endDate: options.endDate,
      },
      stGeorgeAccount: {
        accountNumber: stGeorgeAccount.accountNumber,
        accountType: AccountType.Debit,
        bsbNumber: stGeorgeAccount.bsbNumber,
      },
      stGeorgeCredentials: credentials,
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
