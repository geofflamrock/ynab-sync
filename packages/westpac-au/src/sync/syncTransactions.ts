import { format, subDays } from "date-fns";
import { getUserLocale, importTransactions, parseOfx } from "ynab-sync-core";
import { createBrowser } from "ynab-sync-puppeteer";
import { exportTransactions, login } from "../export";

export type WestpacTransactionSyncParams = {
  westpacUsername: string;
  westpacPassword: string;
  westpacAccountName: string;
  numberOfDaysToSync: number;
  startDate?: Date;
  endDate?: Date;
  importIdTemplate?: string;
  downloadDirectory?: string;
  debug: boolean;
  ynabApiKey: string;
  ynabBudgetId: string;
  ynabAccountId: string;
  loginTimeout?: number;
};

export const syncTransactions = async (
  params: WestpacTransactionSyncParams
) => {
  let endDate = undefined;

  if (params.endDate !== undefined) {
    endDate = params.endDate;
  }

  let startDate = subDays(endDate ?? new Date(), params.numberOfDaysToSync);

  if (params.startDate !== undefined) {
    startDate = params.startDate;
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

  await login(page, params.westpacUsername, params.westpacPassword, {
    debug: params.debug || false,
    loginTimeoutInMs: params.loginTimeout || 2000,
  });

  const outputFilePath = await exportTransactions(
    page,
    params.westpacAccountName,
    params.startDate,
    params.endDate,
    undefined,
    {
      debug: params.debug || false,
      downloadDirectory: params.downloadDirectory,
    }
  );

  if (outputFilePath === undefined) {
    console.log("No transactions found to export");
    return;
  }

  console.log(`Transactions exported successfully to '${outputFilePath}'`);

  console.log(`Parsing transactions from '${outputFilePath}'`);

  const transactions = parseOfx(params.ynabAccountId, outputFilePath, {
    importIdTemplate: params.importIdTemplate,
    debug: params.debug,
  });

  console.log(
    `Parsed ${transactions.length} transactions from '${outputFilePath}'`
  );

  console.log(`Importing ${transactions.length} transactions into YNAB`);

  const importResults = await importTransactions(
    {
      apiKey: params.ynabApiKey,
    },
    params.ynabBudgetId,
    params.ynabAccountId,
    transactions,
    {
      debug: params.debug,
    }
  );

  console.log(
    `Imported ${transactions.length} transactions into YNAB successfully: ${importResults.transactionsCreated.length} created, ${importResults.transactionsUpdated.length} updated, ${importResults.transactionsUnchanged.length} not changed`
  );
};
