import {
  createPageAndLogin,
  exportTransactions,
} from "@geofflamrock/westpac-au-scraper";
import { FileTransactionExportOutput, ITransactionExporter } from "ynab-sync";

export type WestpacTransactionExportInputs = {
  username: string;
  password: string;
  accountName: string;
};

export class WestpacTransactionExporter
  implements
    ITransactionExporter<
      WestpacTransactionExportInputs,
      FileTransactionExportOutput
    >
{
  async export(
    inputs: WestpacTransactionExportInputs
  ): Promise<FileTransactionExportOutput> {
    // const username = inputProvider.getInput("WESTPAC_USERNAME", "Username");
    // const password = inputProvider.getInput("WESTPAC_PASSWORD", "Password");
    // const accountName = inputProvider.getInput(
    //   "WESTPAC_ACCOUNT_NAME",
    //   "Account name"
    // );
    const page = await createPageAndLogin(inputs.username, inputs.password);
    const filePath = await exportTransactions(
      page,
      inputs.accountName,
      new Date("01/06/2021"),
      undefined,
      undefined,
      {
        debug: true,
      }
    );
    console.log(filePath);

    return {
      filePath: filePath,
    };
  }
}
