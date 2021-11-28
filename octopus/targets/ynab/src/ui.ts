import { DeploymentTargetUI, text } from "@octopusdeploy/step-api";
import { YnabTargetInputs } from "./inputs";

export const SyncWestpacAuTransactionsTargetUI: DeploymentTargetUI<YnabTargetInputs> =
  {
    createInitialInputs: () => {
      return {
        test: "",
      };
    },
    editInputsForm: (inputs) => {
      return [
        text({
          input: inputs.test,
          label: "Test",
          helpText: "Test",
        }),
      ];
    },
  };

export default SyncWestpacAuTransactionsTargetUI;
