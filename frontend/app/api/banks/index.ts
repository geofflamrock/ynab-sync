import type { BankAccount } from "@prisma/client";
import { exhaustiveCheck } from "../utils/exhaustiveCheck";
import {
  getStGeorgeBankAccountFields,
  getStGeorgeBankCredentialFields,
} from "./stgeorge";
import {
  getWestpacBankAccountFields,
  getWestpacBankCredentialFields,
} from "./westpac";

export type BankAccountField = {
  name: string;
  displayName: string;
  value: string;
};

export type BankAccountFields = Array<BankAccountField>;

export type BankCredentialField = {
  name: string;
  displayName: string;
};

export type BankCredentialFields = Array<BankCredentialField>;

export type SupportedBankTypes = "stgeorge" | "westpac";

export function getBankType(type: string): SupportedBankTypes {
  switch (type) {
    case "westpac":
      return "westpac";
    case "stgeorge":
      return "stgeorge";
    default:
      throw new Error(`Unknown bank type ${type}`);
  }
}

export function getBankAccountFields(
  bankAccount: BankAccount
): BankAccountFields {
  const bankType = getBankType(bankAccount.type);
  switch (bankType) {
    case "stgeorge":
      return getStGeorgeBankAccountFields(bankAccount);
    case "westpac":
      return getWestpacBankAccountFields(bankAccount);
    default:
      exhaustiveCheck(bankType, "Unknown bank type");
  }
}

export function getBankCredentialFields(
  type: SupportedBankTypes
): BankCredentialFields {
  switch (type) {
    case "stgeorge":
      return getStGeorgeBankCredentialFields();
    case "westpac":
      return getWestpacBankCredentialFields();
    default:
      exhaustiveCheck(type, "Unknown bank type");
  }
}
