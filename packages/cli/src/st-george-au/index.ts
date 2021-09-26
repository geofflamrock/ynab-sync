import { format, isValid, parseISO, subDays, parse } from "date-fns";
import { getUserLocale } from "../util";
import { CsvTransactionParser, YnabTransactionImporter } from "ynab-sync-core";
import { StGeorgeTransactionExporter } from "ynab-sync-st-george-au";
import commander from "commander";

enum AccountType {
  Debit = "Debit",
  Credit = "Credit",
}

export type StGeorgeTransactionExportParams = {
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

export const exportTransactions = async (
  params: StGeorgeTransactionExportParams
) => {
  let endDate = new Date();

  if (params.endDate !== undefined) {
    endDate = params.endDate;
  }

  let startDate = subDays(endDate ?? new Date(), params.numberOfDaysToSync);

  if (params.startDate !== undefined) {
    startDate = params.startDate;
  }

  const exporter = new StGeorgeTransactionExporter();

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

  const output = await exporter.export({
    accessNumber: params.accessNumber,
    password: params.password,
    securityNumber: params.securityNumber,
    bsbNumber: params.bsbNumber,
    accountNumber: params.accountNumber,
    startDate: startDate,
    endDate: endDate,
    downloadDirectory: params.downloadDirectory,
    debug: params.debug,
    loginTimeoutInMs: params.loginTimeout,
  });

  console.log(`Transactions exported successfully to '${output.filePath}'`);

  console.log(`Parsing transactions from '${output.filePath}'`);

  const parser = new CsvTransactionParser();

  const transactions = parser.parse(params.ynabAccountId, output.filePath, {
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
    `Parsed ${transactions.length} transactions from '${output.filePath}'`
  );

  const importer = new YnabTransactionImporter({
    credentials: {
      apiKey: params.ynabApiKey,
    },
    debug: params.debug,
  });

  console.log(`Importing ${transactions.length} transactions into YNAB`);

  const importResults = await importer.import(
    params.ynabBudgetId,
    params.ynabAccountId,
    transactions
  );

  console.log(
    `Imported ${transactions.length} transactions into YNAB successfully: ${importResults.transactionsCreated.length} created, ${importResults.transactionsUpdated.length} updated, ${importResults.transactionsUnchanged.length} not changed`
  );
};

export const createStGeorgeAuSyncCommand = (): commander.Command => {
  return new commander.Command("st-george-au")
    .description("Sync St George Australia transactions to YNAB")
    .requiredOption(
      "--access-number <access-number>",
      "St George customer access number"
    )
    .requiredOption(
      "--password <password>",
      "St George online banking password"
    )
    .requiredOption(
      "--security-number <security-number>",
      "St George security number"
    )
    .requiredOption(
      "--bsb-number  <bsb-number>",
      "BSB number of St George account to sync from"
    )
    .requiredOption(
      "--account-number <account-number>",
      "BSB number of St George account to sync from"
    )
    .option<number>(
      "--number-of-days-to-sync <number-of-days-to-sync>",
      "Numbers of days of transactions to sync",
      (value: string) => parseInt(value),
      7
    )
    .option<Date>(
      "--start-date <start-date>",
      "Start date to sync from in ISO format (yyyy-MM-dd). If this is set then --number-of-days-to-sync is ignored.",
      (value: string) => {
        const date = parseISO(value);
        if (!isValid(date))
          throw new commander.InvalidOptionArgumentError(
            "Date must be be in format 'yyyy-MM-dd'"
          );
        return date;
      },
      undefined
    )
    .option<Date>(
      "--end-date <end-date>",
      "End date to sync to in ISO format (yyyy-MM-dd). If this is set then --number-of-days-to-sync is taken from this date.",
      (value: string) => {
        const date = parseISO(value);
        if (!isValid(date))
          throw new commander.InvalidOptionArgumentError(
            "Date must be be in format 'yyyy-MM-dd'"
          );
        return date;
      },
      undefined
    )
    .option(
      "--import-id-template <import-id-template>",
      "Template to use when constructing the import id. Properties available are {id}, {date}, {amount} and {memo}. Defaults to {id}.",
      "{date}-{amount}-{payee}"
    )
    .option<AccountType>(
      "--account-type",
      "Whether the account is a debit or credit account, changing how debit and credit amounts are handled. Typically transactional/offset accounts would be debit, and home loan accounts would be credit.",
      (value: string) => (<any>AccountType)[value],
      AccountType.Debit
    )
    .option(
      "--download-directory <download-directory>",
      "Directory to use when downloading transaction files"
    )
    .requiredOption("--ynab-api-key <ynab-api-key>", "YNAB Api key")
    .requiredOption(
      "--ynab-budget-id <ynab-budget-id>",
      "Id of YNAB budget to import into"
    )
    .requiredOption(
      "--ynab-account-id <ynab-account-id>",
      "Id of YNAB account to import into"
    )
    .option("--debug", "Whether to run in debug mode", false)
    .option<number>(
      "--login-timeout <login-timeout>",
      "Timeout when logging in to St George online banking (ms)",
      (value: string) => parseInt(value),
      5000
    )
    .action(async (args: StGeorgeTransactionExportParams) => {
      await exportTransactions(args);
    });
};
