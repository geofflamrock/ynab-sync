import { createPageAndLogin, exportTransactions } from "westpac-au-scraper";
import {
  FileTransactionExportOutput,
  ITransactionExporter,
} from "ynab-sync-core";

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
    const page = await createPageAndLogin(inputs.username, inputs.password);
    const filePath = await exportTransactions(
      page,
      inputs.accountName,
      new Date("01/06/2021"), // TEMP
      undefined,
      undefined,
      {
        debug: true,
      }
    );

    return {
      filePath: filePath,
    };
  }
}
