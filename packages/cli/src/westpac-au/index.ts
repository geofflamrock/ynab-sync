import { isValid, parseISO } from "date-fns";
import {
  WestpacTransactionSyncParams,
  syncTransactions,
} from "ynab-sync-westpac-au";
import commander from "commander";
import { consoleLogger } from "../logging/consoleLogger";

type WestpacTransactionSyncCommandArgs = {
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
  toolsDirectory?: string;
};

export const createWestpacAuSyncCommand = (): commander.Command => {
  return new commander.Command("westpac-au")
    .description("Sync Westpac Australia transactions to YNAB")
    .requiredOption(
      "--westpac-username <username>",
      "Westpac online banking username",
      process.env.WESTPAC_USERNAME
    )
    .requiredOption(
      "--westpac-password <password>",
      "Westpac online banking password",
      process.env.WESTPAC_PASSWORD
    )
    .requiredOption(
      "--westpac-account-name  <account-name>",
      "Name of Westpac account to sync from",
      process.env.WESTPAC_ACCOUNT_NAME
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
    .requiredOption(
      "--ynab-api-key <ynab-api-key>",
      "YNAB Api key",
      process.env.YNAB_API_KEY
    )
    .requiredOption(
      "--ynab-budget-id <ynab-budget-id>",
      "Id of YNAB budget to import into",
      process.env.YNAB_BUDGET_ID
    )
    .requiredOption(
      "--ynab-account-id <ynab-account-id>",
      "Id of YNAB account to import into",
      process.env.YNAB_ACCOUNT_ID
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
    .action(async (args: WestpacTransactionSyncCommandArgs) => {
      await syncTransactions(
        {
          westpacCredentials: {
            username: args.westpacUsername,
            password: args.westpacPassword,
          },
          westpacAccount: {
            accountName: args.westpacAccountName,
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
        },
        consoleLogger
      );
    });
};
