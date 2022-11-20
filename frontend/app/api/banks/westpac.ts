import type {
  BankAccount,
  BankCredential,
  YnabAccount,
  YnabCredential,
} from "@prisma/client";
import type { BankAccountFields, BankCredentialFields } from ".";
import { syncTransactions } from "ynab-sync-westpac-au";

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
  ynabCredentials: YnabCredential
) {
  const credentials: WestpacCredentials = JSON.parse(bankCredentials.details);

  await syncTransactions({
    options: {
      debug: true,
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
  });
}
