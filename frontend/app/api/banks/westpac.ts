import type { BankAccount } from "@prisma/client";
import type { BankAccountFields, BankCredentialFields } from ".";

export type WestpacBankAccountDetails = {
  bsbNumber: string;
  accountNumber: string;
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
