import { ValidateInputs } from "@octopusdeploy/step-api";
import { SyncWestpacAuTransactionsInputs } from "./inputs";

const validateInputs: ValidateInputs<SyncWestpacAuTransactionsInputs> = (
  inputs,
  validate
) => {
  return [
    validate(inputs.westpacCredentials.username, (username) => {
      if (username === "") return "Westpac username cannot be empty";
      return undefined;
    }),
    validate(inputs.westpacCredentials.password, (password) => {
      if (password.type === "empty") return "Westpac password cannot be empty";
      return undefined;
    }),
    validate(inputs.westpacAccount.accountName, (accountName) => {
      if (accountName === "") return "Westpac account name cannot be empty";
      return undefined;
    }),
    validate(inputs.ynabCredentials.apiKey, (apiKey) => {
      if (apiKey.type === "empty") return "YNAB API Key cannot be empty";
      return undefined;
    }),
    // todo the rest
  ];
};
export default validateInputs;
