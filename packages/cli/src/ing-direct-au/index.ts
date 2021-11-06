import { isValid, parseISO } from "date-fns";
import {
  IngDirectTransactionSyncParams,
  syncTransactions,
} from "ynab-sync-ing-direct-au";
import commander from "commander";

type IngDirectTransactionSyncCommandArgs = {
  ingDirectClientNumber: string;
  ingDirectAccessCode: string;
  ingDirectAccountNumber: string;
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
  toolsDirectory?: string;
};

export const createIngDirectAuSyncCommand = (): commander.Command => {
  return new commander.Command("ing-direct-au")
    .description("Sync ING Direct Australia transactions to YNAB")
    .requiredOption(
      "--ing-direct-client-number <ing-direct-client-number>",
      "ING Direct client number"
    )
    .requiredOption(
      "--ing-direct-access-code <ing-direct-access-code>",
      "ING Direct access number"
    )
    .requiredOption(
      "--ing-direct-account-number  <account-number>",
      "Number of ING Direct account to sync from"
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
      "{id}"
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
      "Timeout when logging in to Westpac online banking (ms)",
      (value: string) => parseInt(value),
      2000
    )
    .option(
      "--tools-directory <tools-directory>",
      "Directory to use when downloading tools to use during sync"
    )
    .action(async (args: IngDirectTransactionSyncCommandArgs) => {
      await syncTransactions({
        ingDirectCredentials: {
          clientNumber: args.ingDirectClientNumber,
          accessCode: args.ingDirectAccessCode,
        },
        ingDirectAccount: {
          accountNumber: args.ingDirectAccountNumber,
        },
        ynabCredentials: {
          apiKey: args.ynabApiKey,
        },
        ynabAccount: {
          budgetId: args.ynabBudgetId,
          accountId: args.ynabAccountId,
        },
        options: {
          debug: args.debug,
          numberOfDaysToSync: args.numberOfDaysToSync,
          downloadDirectory: args.downloadDirectory,
          endDate: args.endDate,
          importIdTemplate: args.importIdTemplate,
          loginTimeoutInMs: args.loginTimeout,
          startDate: args.startDate,
          toolsDirectory: args.toolsDirectory,
        },
      });
    });
};
