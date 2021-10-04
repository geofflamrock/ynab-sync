import { isValid, parseISO } from "date-fns";
import {
  AccountType,
  StGeorgeTransactionSyncParams,
  syncTransactions,
} from "ynab-sync-st-george-au";
import commander from "commander";

type StGeorgeTransactionSyncCommandArgs = {
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
    .action(async (args: StGeorgeTransactionSyncCommandArgs) => {
      await syncTransactions({
        stGeorgeCredentials: {
          accessNumber: args.accessNumber,
          password: args.password,
          securityNumber: args.securityNumber,
        },
        stGeorgeAccount: {
          bsbNumber: args.bsbNumber,
          accountNumber: args.accountNumber,
          accountType: args.accountType,
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
        },
      });
    });
};
