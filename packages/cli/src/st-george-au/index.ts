import { format, isValid, parseISO, subDays } from "date-fns";
import { getUserLocale } from "../util";
import {
  ITransactionImporter,
  ITransactionParser,
  CsvTransactionParser,
  YnabTransactionImporter,
} from "ynab-sync-core";
import { StGeorgeTransactionExporter } from "ynab-sync-st-george-au";
import commander from "commander";

export type StGeorgeTransactionExportParams = {
  stGeorgeAccessNumber: string;
  stGeorgePassword: string;
  stGeorgeSecurityNumber: number;
  stGeorgeAccountBsb: string;
  stGeorgeAccountNumber: string;
  numberOfDaysToSync: number;
  startDate?: Date;
  endDate?: Date;
  importIdTemplate?: string;
  downloadDirectory?: string;
  debug: boolean;
  ynabApiKey: string;
  ynabBudgetId: string;
  ynabAccountId: string;
};

export const exportTransactions = async (
  params: StGeorgeTransactionExportParams
) => {
  let endDate = undefined;

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
    accessNumber: params.stGeorgeAccessNumber,
    password: params.stGeorgePassword,
    securityNumber: params.stGeorgeSecurityNumber,
    accountBsb: params.stGeorgeAccountBsb,
    accountNumber: params.stGeorgeAccountNumber,
    startDate: startDate,
    endDate: endDate,
    downloadDirectory: params.downloadDirectory,
    debug: params.debug,
  });

  console.log(`Transactions exported successfully to '${output.filePath}'`);

  console.log(`Parsing transactions from '${output.filePath}'`);

  const parser: ITransactionParser = new CsvTransactionParser({
    importIdTemplate: params.importIdTemplate,
    debug: params.debug,
  });

  const transactions = parser.parse(params.ynabAccountId, output.filePath);

  console.log(
    `Parsed ${transactions.length} transactions from '${output.filePath}'`
  );

  const importer: ITransactionImporter = new YnabTransactionImporter({
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
      "--st-george-access-number <st-george-access-number>",
      "St George customer access number"
    )
    .requiredOption(
      "--st-george-password <st-george-password>",
      "St George online banking password"
    )
    .requiredOption(
      "--st-george-security-number <st-george-security-number>",
      "St George security number"
    )
    .requiredOption(
      "--st-george-account-bsb  <account-bsb>",
      "BSB number of St George account to sync from"
    )
    .requiredOption(
      "--st-george-account-number  <account-number>",
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
      "{date}-{memo}-{amount}"
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
    .action(async (args: StGeorgeTransactionExportParams) => {
      await exportTransactions(args);
    });
};
