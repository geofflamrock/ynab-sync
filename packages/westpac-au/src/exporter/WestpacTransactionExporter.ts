import { exportTransactions, login } from "westpac-au-scraper";
import {
  FileTransactionExportOutput,
  ITransactionExporter,
} from "ynab-sync-core";
import { createBrowser } from "ynab-sync-puppeteer";

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
      FileTransactionExportOutput | undefined
    >
{
  async export(
    inputs: WestpacTransactionExportInputs
  ): Promise<FileTransactionExportOutput | undefined> {
    const browser = await createBrowser();
    const page = await browser.newPage();

    await login(page, inputs.username, inputs.password);
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

    if (filePath === undefined) return undefined;

    return {
      filePath: filePath,
    };
  }
}
