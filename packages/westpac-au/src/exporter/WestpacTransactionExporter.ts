import { createPageAndLogin, exportTransactions } from "westpac-au-scraper";
import {
  FileTransactionExportOutput,
  ITransactionExporter,
} from "ynab-sync-core";

export type WestpacTransactionExportInputs = {
  username: string;
  password: string;
  accountName: string;
  startDate?: Date;
  endDate?: Date;
  downloadDirectory?: string;
  debug?: boolean;
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
      inputs.startDate,
      inputs.endDate,
      undefined,
      {
        debug: inputs.debug || false,
        downloadDirectory: inputs.downloadDirectory,
      }
    );

    return {
      filePath: filePath,
    };
  }
}
