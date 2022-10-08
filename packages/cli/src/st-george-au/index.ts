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
  toolsDirectory?: string;
};

export const createStGeorgeAuSyncCommand = (): commander.Command => {
  return new commander.Command("st-george-au")
    .description("Sync St George Australia transactions to YNAB")
    .requiredOption(
      "--access-number <access-number>",
      "St George customer access number",
      process.env.ST_GEORGE_ACCESS_NUMBER
    )
    .requiredOption(
      "--password <password>",
      "St George online banking password",
      process.env.ST_GEORGE_PASSWORD
    )
    .requiredOption(
      "--security-number <security-number>",
      "St George security number",
      process.env.ST_GEORGE_SECURITY_NUMBER
    )
    .requiredOption(
      "--bsb-number  <bsb-number>",
      "BSB number of St George account to sync from",
      process.env.ST_GEORGE_BSB_NUMBER
    )
    .requiredOption(
      "--account-number <account-number>",
      "BSB number of St George account to sync from",
      process.env.ST_GEORGE_ACCOUNT_NUMBER
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
      process.env.ST_GEORGE_ACCOUNT_TYPE !== undefined
        ? (<any>AccountType)[process.env.ST_GEORGE_ACCOUNT_TYPE]
        : AccountType.Debit
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
      "Timeout when logging in to St George online banking (ms)",
      (value: string) => parseInt(value),
      5000
    )
    .option(
      "--tools-directory <tools-directory>",
      "Directory to use when downloading tools to use during sync"
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
          toolsDirectory: args.toolsDirectory,
        },
      });
    });
};
