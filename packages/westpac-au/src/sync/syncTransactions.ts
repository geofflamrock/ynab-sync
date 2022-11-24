import { format, subDays } from "date-fns";
import path from "path";
import {
  getUserLocale,
  importTransactions,
  Logger,
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
  toolsDirectory?: string;
};

export type WestpacTransactionSyncParams = {
  westpacCredentials: WestpacCredentials;
  westpacAccount: WestpacAccount;
  ynabCredentials: YnabCredentials;
  ynabAccount: YnabAccount;
  options: WestpacSyncOptions;
};

export const syncTransactions = async (
  params: WestpacTransactionSyncParams,
  logger: Logger
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

  logger.info(
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

  const chromiumDownloadDirectory =
    params.options.toolsDirectory !== undefined
      ? path.join(params.options.toolsDirectory, ".chromium")
      : undefined;

  const browser = await createBrowser(logger, chromiumDownloadDirectory);
  const page = await browser.newPage();

  await login(
    page,
    params.westpacCredentials.username,
    params.westpacCredentials.password,
    {
      debug: params.options.debug || false,
      loginTimeoutInMs: params.options.loginTimeoutInMs || 2000,
    },
    logger
  );

  const outputFilePath = await exportTransactions(
    page,
    logger,
    params.westpacAccount.accountName,
    startDate,
    endDate,
    undefined,
    {
      debug: params.options.debug || false,
      downloadDirectory: params.options.downloadDirectory,
    }
  );

  if (outputFilePath === undefined) {
    logger.info("No transactions found to export");
    return;
  }

  logger.info(`Transactions exported successfully to '${outputFilePath}'`);

  logger.info(`Parsing transactions from '${outputFilePath}'`);

  const transactions = parseOfx(
    params.ynabAccount.accountId,
    outputFilePath,
    {
      importIdTemplate: params.options.importIdTemplate,
      debug: params.options.debug,
    },
    logger
  );

  logger.info(
    `Parsed ${transactions.length} transactions from '${outputFilePath}'`
  );

  logger.info(`Importing ${transactions.length} transactions into YNAB`);

  const importResults = await importTransactions(
    params.ynabCredentials,
    params.ynabAccount,
    transactions,
    {
      debug: params.options.debug,
    },
    logger
  );

  logger.info(
    `Imported ${transactions.length} transactions into YNAB successfully: ${importResults.transactionsCreated.length} created, ${importResults.transactionsUpdated.length} updated, ${importResults.transactionsUnchanged.length} not changed`
  );
};
