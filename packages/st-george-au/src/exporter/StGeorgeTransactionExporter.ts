import { Page, TimeoutError } from "puppeteer";
import { format, addMilliseconds } from "date-fns";
import path from "path";
import tmp from "tmp";
import fs from "fs";
import {
  FileTransactionExportOutput,
  ITransactionExporter,
} from "ynab-sync-core";
import { createBrowser } from "ynab-sync-puppeteer";

export enum ExportFormat {
  Csv,
}

function getFileExtension(exportFormat: ExportFormat): string {
  switch (exportFormat) {
    case ExportFormat.Csv: {
      return ".csv";
    }
    default: {
      throw new Error("Unknown export format");
    }
  }
}

type LoginOptions = {
  debug: boolean;
  navigationTimeoutInMs: number;
};

async function login(
  page: Page,
  accessNumber: string,
  password: string,
  securityNumber: number,
  options: LoginOptions = {
    debug: false,
    navigationTimeoutInMs: 2000,
  }
): Promise<void> {
  await page.goto("https://ibanking.stgeorge.com.au/ibank/loginPage.action");

  await page.type("#access-number", accessNumber);
  await page.type("#securityNumber", securityNumber.toString());
  await page.type("#internet-password", password);
  try {
    await Promise.all([
      page.click("#logonButton"),
      page.waitForNavigation({ timeout: options.navigationTimeoutInMs }),
    ]);
  } catch (e) {
    let timeoutError: TimeoutError = e;

    if (!timeoutError) {
      throw e;
    } else {
      if (options.debug)
        console.log("A timeout error has occurred attempting to login");
    }
  }

  const url = page.url();

  if (
    url !== "https://ibanking.stgeorge.com.au/ibank/viewAccountPortfolio.html"
  ) {
    throw new Error("An unknown login error has occurred"); // temp
  }
}

async function exportTransactions(
  page: Page,
  bsbNumber: string,
  accountNumber: string,
  startDate?: Date,
  endDate?: Date,
  exportFormat: ExportFormat = ExportFormat.Csv,
  options: {
    debug?: boolean;
    downloadTimeoutInMs?: number;
    downloadDirectory?: string;
  } = {
    debug: false,
    downloadTimeoutInMs: 300000,
  }
): Promise<string> {
  await page.goto(
    "https://ibanking.stgeorge.com.au/ibank/viewAccountPortfolio.html"
  );

  const bsbNumberElements = await page.$$(
    "#acctSummaryList > li > dl.account-number-details > dt.bsb-number + dd"
  );

  const bsbNumbers = await Promise.all(
    bsbNumberElements.map(async (el) =>
      (
        await (await el.getProperty("textContent"))?.jsonValue<string>()
      )?.replace("-", "")
    )
  );

  if (options.debug)
    console.log(`Found ${bsbNumbers.length} bsb numbers`, bsbNumbers);

  const accountNumberElements = await page.$$(
    "#acctSummaryList > li > dl.account-number-details > dt.account-number + dd"
  );

  const accountNumbers = await Promise.all(
    accountNumberElements.map(async (el) =>
      (await (await el.getProperty("textContent"))?.jsonValue<string>())
        ?.replace(/\t/gi, "")
        .replace(/\n/gi, "")
        .replace(/\s/gi, "")
    )
  );

  if (options.debug)
    console.log(
      `Found ${accountNumbers.length} account numbers`,
      accountNumbers
    );

  type Account = {
    bsbNumber: string;
    accountNumber: string;
  };

  let accounts: Array<Account> = new Array<Account>();
  for (let index = 0; index < bsbNumbers.length; index++) {
    accounts.push({
      bsbNumber: bsbNumbers[index] || "",
      accountNumber: accountNumbers[index] || "",
    });
  }

  if (options.debug) console.log(`Found ${accounts.length} accounts`, accounts);

  const accountIndex: number = accounts.findIndex(
    (a) => a.bsbNumber === bsbNumber && a.accountNumber === accountNumber
  );

  if (accountIndex < 0) {
    throw new Error(
      `Could not find account with bsb '${bsbNumber}' and number '${accountNumber}'`
    );
  }

  await page.goto(
    `https://ibanking.stgeorge.com.au/ibank/accountDetails.action?index=${accountIndex}`
  );

  await page.click("#ui-id-4"); // Select a date range tab

  if (startDate !== undefined) {
    const startDateFormatted = format(startDate, "dd/MM/yyyy");
    await page.click("#acctDetDateFrom");
    await page.type("#acctDetDateFrom", startDateFormatted);
  }

  if (endDate !== undefined) {
    const endDateFormatted = format(endDate, "dd/MM/yyyy");
    await page.click("#acctDetDateTo");
    await page.type("#acctDetDateTo", endDateFormatted);
  }

  let downloadDirectory = options.downloadDirectory;

  if (downloadDirectory === undefined) {
    const tempDir = tmp.dirSync();
    downloadDirectory = tempDir.name;
  } else {
    fs.mkdirSync(path.resolve(downloadDirectory));
  }

  if (options.debug)
    console.log(`Exporting transactions to '${downloadDirectory}'`);

  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadDirectory,
  });
  await page.click("#transHistExport");

  let transactionsFile = "";

  const downloadTimeoutTime = addMilliseconds(
    new Date(),
    options.downloadTimeoutInMs || 300000 // 5 minutes
  );

  while (true) {
    if (options.debug)
      console.log(`Checking for downloaded file in '${downloadDirectory}'`);

    const downloadDirFiles = fs.readdirSync(downloadDirectory, {
      withFileTypes: true,
    });

    if (downloadDirFiles.length > 0) {
      downloadDirFiles.forEach((file) => {
        if (
          file.isFile() &&
          path.extname(file.name).toLowerCase() ==
            getFileExtension(exportFormat).toLowerCase()
        )
          transactionsFile = path.join(downloadDirectory || "", file.name);
      });

      break;
    }

    if (new Date() > downloadTimeoutTime) {
      throw new Error("Transaction file download has timed out");
    }

    await page.waitForTimeout(1000);
  }

  return transactionsFile;
}

export type StGeorgeTransactionExportInputs = {
  accessNumber: string;
  password: string;
  securityNumber: number;
  bsbNumber: string;
  accountNumber: string;
  startDate?: Date;
  endDate?: Date;
  downloadDirectory?: string;
  debug?: boolean;
};

export class StGeorgeTransactionExporter {
  async export(
    inputs: StGeorgeTransactionExportInputs
  ): Promise<FileTransactionExportOutput> {
    const browser = await createBrowser();
    const page = await browser.newPage();

    await login(
      page,
      inputs.accessNumber,
      inputs.password,
      inputs.securityNumber,
      {
        debug: inputs.debug || false,
        navigationTimeoutInMs: 2000,
      }
    );
    const filePath = await exportTransactions(
      page,
      inputs.bsbNumber,
      inputs.accountNumber,
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
