import { SyncWestpacAuTransactionsInputs } from "./inputs";
import { StepExecutor } from "@octopusdeploy/step-api";
import { syncTransactions } from "ynab-sync-westpac-au";
import { YnabTargetInputs } from "ynab-target-octopus";

const SyncWestpacAuTransactionsExecutor: StepExecutor<
  SyncWestpacAuTransactionsInputs,
  YnabTargetInputs
> = async ({ inputs, context }) => {
  context.print(
    `Syncing transactions between Westpac account '${inputs.westpacAccount.accountName}' and YNAB`
  );
  await syncTransactions({
    westpacCredentials: {
      username: inputs.westpacCredentials.username,
      password: inputs.westpacCredentials.password,
    },
    westpacAccount: {
      accountName: inputs.westpacAccount.accountName,
    },
    ynabCredentials: {
      apiKey: inputs.ynabCredentials.apiKey,
    },
    ynabAccount: {
      budgetId: inputs.ynabAccount.budgetId,
      accountId: inputs.ynabAccount.accountId,
    },
    options: {
      debug: inputs.options.debug,
      numberOfDaysToSync: inputs.options.numberOfDaysToSync,
      downloadDirectory: inputs.options.downloadDirectory,
      loginTimeoutInMs: inputs.options.loginTimeoutInMs,
      toolsDirectory: inputs.options.toolsDirectory,
    },
  });
};

export default SyncWestpacAuTransactionsExecutor;
