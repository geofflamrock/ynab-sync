import type { BankAccount } from "@prisma/client";
import type { BankAccountFields, BankCredentialFields } from ".";

export type StGeorgeBankAccountDetails = {
  bsbNumber: string;
  accountNumber: string;
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
