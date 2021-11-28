import { YnabTargetInputs } from "./inputs";
import { HealthCheckExecutor } from "@octopusdeploy/step-api";

const YnabTargetHealthCheckExecutor: HealthCheckExecutor<YnabTargetInputs> =
  async ({ context }) => {
    context.print(`Whatevs`);
  };

export default YnabTargetHealthCheckExecutor;
