import type {
  BankAccount,
  BankCredential,
  Sync,
  YnabAccount,
  YnabCredential,
} from "@prisma/client";
import { parseSyncOptions } from "api/sync";
import { exhaustiveCheck } from "../utils/exhaustiveCheck";
import {
  getStGeorgeBankAccountFields,
  getStGeorgeBankCredentialFields,
  syncStGeorgeAccount,
} from "./stgeorge";
import {
  getWestpacBankAccountFields,
  getWestpacBankCredentialFields,
  syncWestpacAccount,
} from "./westpac";
import type { Logger } from "ynab-sync-core";

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
  bankCredentials: BankCredential
): BankCredentialFields {
  const bankType = getBankType(bankCredentials.type);
  switch (bankType) {
    case "stgeorge":
      return getStGeorgeBankCredentialFields();
    case "westpac":
      return getWestpacBankCredentialFields();
    default:
      exhaustiveCheck(bankType, "Unknown bank type");
  }
}

export async function syncBankAccountToYnab(
  sync: Sync,
  bankAccount: BankAccount,
  bankCredentials: BankCredential,
  ynabAccount: YnabAccount,
  ynabCredentials: YnabCredential,
  logger: Logger
) {
  const bankType = getBankType(bankAccount.type);
  const syncOptions = parseSyncOptions(sync.details);

  switch (bankType) {
    case "stgeorge":
      await syncStGeorgeAccount(
        bankAccount,
        bankCredentials,
        ynabAccount,
        ynabCredentials,
        syncOptions,
        logger
      );
      break;

    case "westpac":
      await syncWestpacAccount(
        bankAccount,
        bankCredentials,
        ynabAccount,
        ynabCredentials,
        syncOptions,
        logger
      );
      break;

    default:
      exhaustiveCheck(bankType, "Unknown bank type");
  }
}
