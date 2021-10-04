import { format, subDays } from "date-fns";
import {
  getUserLocale,
  importTransactions,
  parseOfx,
  YnabAccount,
  YnabCredentials,
} from "ynab-sync-core";
import { createBrowser } from "ynab-sync-puppeteer";
import { exportTransactions, login } from "../export";

type WestpacCredentials = {
  username: string;
  password: string;
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
};

export type WestpacTransactionSyncParams = {
  westpacCredentials: WestpacCredentials;
  westpacAccount: WestpacAccount;
  ynabCredentials: YnabCredentials;
  ynabAccount: YnabAccount;
  options: WestpacSyncOptions;
};

export const syncTransactions = async (
  params: WestpacTransactionSyncParams
) => {
  let endDate = undefined;

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

  const locale = await getUserLocale();

  console.log(
    `Exporting Westpac transactions with date range of '${format(
      startDate,
      "P",
      {
        locale: locale,
      }
    )}' to '${format(endDate ?? new Date(), "P", {
      locale: locale,
    })}'`
  );

  const browser = await createBrowser();
  const page = await browser.newPage();

  await login(
    page,
    params.westpacCredentials.username,
    params.westpacCredentials.password,
    {
      debug: params.options.debug || false,
      loginTimeoutInMs: params.options.loginTimeoutInMs || 2000,
    }
  );

  const outputFilePath = await exportTransactions(
    page,
    params.westpacAccount.accountName,
    params.options.startDate,
    params.options.endDate,
    undefined,
    {
      debug: params.options.debug || false,
      downloadDirectory: params.options.downloadDirectory,
    }
  );

  if (outputFilePath === undefined) {
    console.log("No transactions found to export");
    return;
  }

  console.log(`Transactions exported successfully to '${outputFilePath}'`);

  console.log(`Parsing transactions from '${outputFilePath}'`);

  const transactions = parseOfx(params.ynabAccount.accountId, outputFilePath, {
    importIdTemplate: params.options.importIdTemplate,
    debug: params.options.debug,
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
