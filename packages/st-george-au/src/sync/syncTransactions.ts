import { format, parse, subDays } from "date-fns";
import { exportTransactions } from "../export/exportTransactions";
import { login } from "../export/login";
import {
  getUserLocale,
  importTransactions,
  parseCsv,
  YnabCredentials,
  YnabAccount,
  Logger,
  TransactionImportResults,
} from "ynab-sync-core";
import { createBrowser } from "ynab-sync-puppeteer";
import path from "path";

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
  toolsDirectory?: string;
};

export type StGeorgeTransactionSyncParams = {
  stGeorgeCredentials: StGeorgeCredentials;
  stGeorgeAccount: StGeorgeAccount;
  ynabCredentials: YnabCredentials;
  ynabAccount: YnabAccount;
  options: StGeorgeSyncOptions;
};

export const syncTransactions = async (
  params: StGeorgeTransactionSyncParams,
  logger: Logger
): Promise<TransactionImportResults> => {
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

  const chromiumDownloadDirectory =
    params.options.toolsDirectory !== undefined
      ? path.join(params.options.toolsDirectory, ".chromium")
      : undefined;

  const browser = await createBrowser(logger, chromiumDownloadDirectory);
  const page = await browser.newPage();
  const locale = await getUserLocale();

  logger.info(
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
    },
    logger
  );

  const outputFilePath = await exportTransactions(
    page,
    logger,
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
    logger.info("No transactions found to export");
    return {
      transactionsCreated: [],
      transactionsUnchanged: [],
      transactionsUpdated: [],
    };
  }

  logger.info(`Transactions exported successfully to '${outputFilePath}'`);

  logger.info(`Parsing transactions from '${outputFilePath}'`);

  const transactions = parseCsv(
    params.ynabAccount.accountId,
    outputFilePath,
    {
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

  return importResults;
};
