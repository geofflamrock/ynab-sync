import { format, parse, subDays } from "date-fns";
import { exportTransactions } from "../export/exportTransactions";
import { login } from "../export/login";
import { getUserLocale, importTransactions, parseCsv } from "ynab-sync-core";
import { createBrowser } from "ynab-sync-puppeteer";

export enum AccountType {
  Debit = "Debit",
  Credit = "Credit",
}

export type StGeorgeTransactionSyncParams = {
  accessNumber: string;
  password: string;
  securityNumber: number;
  bsbNumber: string;
  accountNumber: string;
  numberOfDaysToSync: number;
  startDate?: Date;
  endDate?: Date;
  importIdTemplate?: string;
  accountType: AccountType;
  downloadDirectory?: string;
  debug: boolean;
  ynabApiKey: string;
  ynabBudgetId: string;
  ynabAccountId: string;
  loginTimeout?: number;
};

export const syncTransactions = async (
  params: StGeorgeTransactionSyncParams
) => {
  let endDate = new Date();

  if (params.endDate !== undefined) {
    endDate = params.endDate;
  }

  let startDate = subDays(endDate ?? new Date(), params.numberOfDaysToSync);

  if (params.startDate !== undefined) {
    startDate = params.startDate;
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
    params.accessNumber,
    params.password,
    params.securityNumber,
    {
      debug: params.debug || false,
      loginTimeoutInMs: params.loginTimeout || 5000,
    }
  );

  const outputFilePath = await exportTransactions(
    page,
    params.bsbNumber,
    params.accountNumber,
    startDate,
    endDate,
    undefined,
    {
      downloadDirectory: params.downloadDirectory,
      debug: params.debug,
    }
  );

  console.log(`Transactions exported successfully to '${outputFilePath}'`);

  console.log(`Parsing transactions from '${outputFilePath}'`);

  const transactions = parseCsv(params.ynabAccountId, outputFilePath, {
    importIdTemplate: params.importIdTemplate,
    debug: params.debug,
    getDate: (input: any) => parse(input.Date, "dd/MM/yyyy", new Date()),
    getAmount: (input: any) => {
      if (input.Debit) {
        return (
          input.Debit * (params.accountType === AccountType.Debit ? -1 : 1)
        );
      } else {
        return (
          input.Credit * (params.accountType === AccountType.Credit ? -1 : 1)
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
