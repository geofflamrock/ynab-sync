import { Page } from "puppeteer";
import { format, addMilliseconds } from "date-fns";
import path from "path";
import tmp from "tmp";
import fs from "fs";
import { Logger } from "ynab-sync-core";

export enum ExportFormat {
  Ofx,
}

function getFileTypeSelector(exportFormat: ExportFormat): string {
  switch (exportFormat) {
    case ExportFormat.Ofx: {
      return "#File_type_3";
    }
    default: {
      throw new Error("Unknown export format");
    }
  }
}

function getFileExtension(exportFormat: ExportFormat): string {
  switch (exportFormat) {
    case ExportFormat.Ofx: {
      return ".ofx";
    }
    default: {
      throw new Error("Unknown export format");
    }
  }
}

async function getExportTransactionsAlert(
  page: Page
): Promise<string | undefined> {
  const alert = await page.$(
    "#alertManagerArea .alert.alert-error .alert-icon"
  );

  if (alert !== null) {
    const alertMessage: string = (
      await page.evaluate((element) => element.textContent, alert)
    ).trim();
    return alertMessage;
  }

  return undefined;
}

async function getExportTransactionsError(
  page: Page
): Promise<string | undefined> {
  const alert = await getExportTransactionsAlert(page);

  if (
    alert !== null &&
    alert !==
      "No data is available for the export search criteria entered. Please try again using different criteria."
  ) {
    return alert;
  }
  return undefined;
}

async function doesExportContainData(page: Page): Promise<boolean> {
  const alert = await getExportTransactionsAlert(page);

  if (alert !== null) {
    if (
      alert ===
      "No data is available for the export search criteria entered. Please try again using different criteria."
    )
      return false;
  }
  return true;
}

export const exportTransactions = async (
  page: Page,
  logger: Logger,
  accountName: string,
  startDate?: Date,
  endDate?: Date,
  exportFormat: ExportFormat = ExportFormat.Ofx,
  options: {
    debug?: boolean;
    downloadTimeoutInMs?: number;
    downloadDirectory?: string;
  } = {
    debug: false,
    downloadTimeoutInMs: 300000,
  }
): Promise<string | undefined> => {
  await page.goto(
    "https://banking.westpac.com.au/secure/banking/reportsandexports/exportparameters/2/"
  );

  if (startDate !== undefined) {
    const startDateFormatted = format(startDate, "dd/MM/yyyy");

    if (options.debug)
      logger.info(`Setting start date '${startDateFormatted}'`);

    await page.click("#DateRange_StartDate", { clickCount: 3 });
    await page.type("#DateRange_StartDate", startDateFormatted);
  }

  if (endDate !== undefined) {
    const endDateFormatted = format(endDate, "dd/MM/yyyy");

    if (options.debug) logger.info(`Setting end date '${endDateFormatted}'`);

    await page.click("#DateRange_EndDate", { clickCount: 3 });
    await page.type("#DateRange_EndDate", endDateFormatted);
  }

  if (options.debug) logger.info(`Selecting account '${accountName}'`);

  await page.type("#Accounts_1", accountName);
  await page.waitForTimeout(2000);
  await page.waitForSelector(".autosuggest-suggestions:first-child");
  await page.click(".autosuggest-suggestions:first-child");

  const fileTypeSelector = getFileTypeSelector(exportFormat);

  if (options.debug)
    logger.info(`Setting export format '${ExportFormat[exportFormat]}'`);

  await page.waitForTimeout(2000);
  await page.waitForSelector(fileTypeSelector);
  await page.click(fileTypeSelector);

  let downloadDirectory = options.downloadDirectory;

  if (downloadDirectory === undefined) {
    const tempDir = tmp.dirSync();
    downloadDirectory = tempDir.name;
  } else {
    fs.mkdirSync(path.resolve(downloadDirectory));
  }

  if (options.debug)
    logger.info(`Exporting transactions to '${downloadDirectory}'`);

  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadDirectory,
  });
  await page.click(".btn-actions > .btn.export-link");
  await page.waitForTimeout(2000);

  const exportAlert = await getExportTransactionsError(page);

  if (exportAlert !== undefined) {
    throw new Error(exportAlert);
  }

  if (!(await doesExportContainData(page))) {
    if (options.debug) logger.info(`Transaction export contains no data`);
    return undefined;
  }

  let transactionsFile: string | undefined = undefined;

  const downloadTimeoutTime = addMilliseconds(
    new Date(),
    options.downloadTimeoutInMs || 300000 // 5 minutes
  );

  while (true) {
    if (options.debug)
      logger.info(`Checking for downloaded file in '${downloadDirectory}'`);

    const downloadDirFiles = fs.readdirSync(downloadDirectory, {
      withFileTypes: true,
    });

    if (downloadDirFiles.length > 0) {
      downloadDirFiles.forEach((file) => {
        if (options.debug)
          logger.info(`Checking downloaded file '${file.name}'`);

        if (
          file.isFile() &&
          path.extname(file.name).toLowerCase() ==
            getFileExtension(exportFormat).toLowerCase()
        ) {
          if (options.debug)
            logger.info(`Found transactions file '${file.name}'`);

          transactionsFile = path.join(downloadDirectory || "", file.name);
        }
      });

      if (transactionsFile) break;
    }

    if (new Date() > downloadTimeoutTime) {
      throw new Error("Transaction file download has timed out");
    }

    await page.waitForTimeout(1000);
  }

  return transactionsFile;
};
