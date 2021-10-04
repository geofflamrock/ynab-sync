import { format, parse, subDays } from "date-fns";
import { exportTransactions } from "../export/exportTransactions";
import { login } from "../export/login";
import {
  getUserLocale,
  importTransactions,
  parseCsv,
  YnabCredentials,
  YnabAccount,
} from "ynab-sync-core";
import { createBrowser } from "ynab-sync-puppeteer";

export enum AccountType {
  Debit = "Debit",
  Credit = "Credit",
}

type StGeorgeCredentials = {
  accessNumber: string;
  password: string;
  securityNumber: number;
};

type StGeorgeAccount = {
  bsbNumber: string;
  accountNumber: string;
  accountType: AccountType;
};

type StGeorgeSyncOptions = {
  numberOfDaysToSync: number;
  startDate?: Date;
  endDate?: Date;
  importIdTemplate?: string;
  downloadDirectory?: string;
  debug: boolean;
  loginTimeoutInMs?: number;
};

export type StGeorgeTransactionSyncParams = {
  stGeorgeCredentials: StGeorgeCredentials;
  stGeorgeAccount: StGeorgeAccount;
  ynabCredentials: YnabCredentials;
  ynabAccount: YnabAccount;
  options: StGeorgeSyncOptions;
};

export const syncTransactions = async (
  params: StGeorgeTransactionSyncParams
) => {
  let endDate = new Date();

  if (params.options.endDate !== undefined) {
    endDate = params.options.endDate;
  }

  let startDate = subDays(
    endDate ?? new Date(),
    params.options.numberOfDaysToSync
  );

  if (params.options.startDate !== undefined) {
    startDate = params.options.startDate;
  }

  const browser = await createBrowser();
  const page = await browser.newPage();
  const locale = await getUserLocale();

  console.log(
    `Exporting St George transactions with date range of '${format(
      startDate,
      "P",
      {
        locale: locale,
      }
    )}' to '${format(endDate ?? new Date(), "P", {
      locale: locale,
    })}'`
  );

  await login(
    page,
    params.stGeorgeCredentials.accessNumber,
    params.stGeorgeCredentials.password,
    params.stGeorgeCredentials.securityNumber,
    {
      debug: params.options.debug || false,
      loginTimeoutInMs: params.options.loginTimeoutInMs || 5000,
    }
  );

  const outputFilePath = await exportTransactions(
    page,
    params.stGeorgeAccount.bsbNumber,
    params.stGeorgeAccount.accountNumber,
    startDate,
    endDate,
    undefined,
    {
      downloadDirectory: params.options.downloadDirectory,
      debug: params.options.debug,
    }
  );

  if (outputFilePath === undefined) {
    console.log("No transactions found to export");
    return;
  }

  console.log(`Transactions exported successfully to '${outputFilePath}'`);

  console.log(`Parsing transactions from '${outputFilePath}'`);

  const transactions = parseCsv(params.ynabAccount.accountId, outputFilePath, {
    importIdTemplate: params.options.importIdTemplate,
    debug: params.options.debug,
    getDate: (input: any) => parse(input.Date, "dd/MM/yyyy", new Date()),
    getAmount: (input: any) => {
      if (input.Debit) {
        return (
          input.Debit *
          (params.stGeorgeAccount.accountType === AccountType.Debit ? -1 : 1)
        );
      } else {
        return (
          input.Credit *
          (params.stGeorgeAccount.accountType === AccountType.Credit ? -1 : 1)
        );
      }
    },
    getMemo: (input: any) => undefined,
    getPayee: (input: any) => input.Description,
  });

  console.log(
    `Parsed ${transactions.length} transactions from '${outputFilePath}'`
  );

  console.log(`Importing ${transactions.length} transactions into YNAB`);

  const importResults = await importTransactions(
    params.ynabCredentials,
    params.ynabAccount,
    transactions,
    {
      debug: params.options.debug,
    }
  );

  console.log(
    `Imported ${transactions.length} transactions into YNAB successfully: ${importResults.transactionsCreated.length} created, ${importResults.transactionsUpdated.length} updated, ${importResults.transactionsUnchanged.length} not changed`
  );
};
