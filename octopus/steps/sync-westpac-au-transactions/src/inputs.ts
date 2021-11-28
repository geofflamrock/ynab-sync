import { SensitiveValue } from "@octopusdeploy/step-api";

type WestpacCredentials = {
  username: string;
  password: SensitiveValue;
};

type WestpacAccount = {
  accountName: string;
};

type WestpacSyncOptions = {
  numberOfDaysToSync: number;
  startDate?: Date;
  endDate?: Date;
  importIdTemplate?: string;
  downloadDirectory?: string;
  debug: boolean;
  loginTimeoutInMs?: number;
  toolsDirectory?: string;
};

type YnabCredentials = {
  apiKey: SensitiveValue;
};

type YnabAccount = {
  budgetId: string;
  accountId: string;
};

export type SyncWestpacAuTransactionsInputs = {
  westpacCredentials: WestpacCredentials;
  westpacAccount: WestpacAccount;
  ynabCredentials: YnabCredentials;
  ynabAccount: YnabAccount;
  options: WestpacSyncOptions;
};

export default SyncWestpacAuTransactionsInputs;
