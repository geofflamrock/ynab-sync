import { ValidateInputs } from "@octopusdeploy/step-api";
import { YnabTargetInputs } from "./inputs";

const validateInputs: ValidateInputs<YnabTargetInputs> = (inputs, validate) => {
  return [
    validate(inputs.test, (test) => {
      if (test === "") return "Test cannot be empty";
      return undefined;
    }),
  ];
};
export default validateInputs;
