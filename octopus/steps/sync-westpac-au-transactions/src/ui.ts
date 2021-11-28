import {
  StepUI,
  text,
  section,
  sensitiveText,
  note,
  number,
  checkbox,
} from "@octopusdeploy/step-api";
import { SyncWestpacAuTransactionsInputs } from "./inputs";

export const SyncWestpacAuTransactionsStepUI: StepUI<SyncWestpacAuTransactionsInputs> =
  {
    createInitialInputs: () => {
      return {
        westpacCredentials: {
          username: "",
        },
        westpacAccount: {
          accountName: "",
        },
        ynabCredentials: {},
        ynabAccount: {
          budgetId: "",
          accountId: "",
        },
        options: {
          debug: false,
          numberOfDaysToSync: 7,
        },
      };
    },
    editInputsForm: (inputs) => {
      return [
        section({
          title: "Westpac Credentials",
          content: [
            text({
              input: inputs.westpacCredentials.username,
              label: "Username",
              helpText: "Username for Westpac Online Banking",
            }),
            sensitiveText({
              input: inputs.westpacCredentials.password,
              label: "Password",
              helpText: "Password for Westpac Online Banking",
            }),
          ],
        }),
        section({
          title: "Westpac Account",
          content: [
            text({
              input: inputs.westpacAccount.accountName,
              label: "Account Name",
              helpText: "Name of the account to sync transactions from",
            }),
          ],
        }),
        section({
          title: "YNAB Credentials",
          content: [
            sensitiveText({
              input: inputs.ynabCredentials.apiKey,
              label: "API Key",
              helpText: "YNAB API Key to allow access to sync transactions",
              note: note`You can find this in your YNAB account settings`,
            }),
          ],
        }),
        section({
          title: "YNAB Account",
          content: [
            text({
              input: inputs.ynabAccount.budgetId,
              label: "Budget Id",
              helpText: "Id of the budget to sync transactions to",
            }),
            text({
              input: inputs.ynabAccount.accountId,
              label: "Account Id",
              helpText: "Id of the account to sync transactions to",
            }),
          ],
        }),
        section({
          title: "Sync Details",
          content: [
            number({
              input: inputs.options.numberOfDaysToSync,
              label: "Number of Days to Sync",
              helpText: "Number of days to sync transactions for",
            }),
            number({
              input: inputs.options.loginTimeoutInMs.convertTo({
                toNewType: (value) => (value === undefined ? 0 : value),
                toOriginalType: (value) => (value === 0 ? undefined : value),
              }),
              label: "Login timeout",
              helpText:
                "The timeout when attempting to login to Westpac Online Banking",
            }),
          ],
        }),
        section({
          title: "Advanced",
          content: [
            checkbox({
              input: inputs.options.debug,
              label: "Debug",
              helpText: "Enable debug logging",
            }),
            text({
              input: inputs.options.toolsDirectory.convertTo({
                toNewType: (value) => (value === undefined ? "" : value),
                toOriginalType: (value) => (value === "" ? undefined : value),
              }),
              label: "Tools Directory",
              helpText: "Path to the tools directory containing Chrome",
            }),
            text({
              input: inputs.options.downloadDirectory.convertTo({
                toNewType: (value) => (value === undefined ? "" : value),
                toOriginalType: (value) => (value === "" ? undefined : value),
              }),
              label: "Download Directory",
              helpText: "Path to the directory to download files to",
            }),
          ],
        }),
      ];
    },
  };

export default SyncWestpacAuTransactionsStepUI;
