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
  Qif,
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
  navigationTimeoutInMs: number;
};

// async function getLoginError(page: Page): Promise<string | undefined> {
//   const alert = await page.$(".alert.alert-error .alert-icon");

//   if (alert !== null) {
//     const alertMessage: string = (
//       await page.evaluate((element) => element.textContent, alert)
//     ).trim();
//     if (
//       alertMessage.startsWith(
//         "The details entered don't match those on our system"
//       )
//     )
//       return "The details entered don't match those on our system";
//     else {
//       return alertMessage;
//     }
//   }

//   return undefined;
// }

async function login(
  page: Page,
  accessNumber: string,
  password: string,
  securityNumber: number,
  options: LoginOptions = {
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
    }
  }

  const url = page.url();

  if (
    url !== "https://ibanking.stgeorge.com.au/ibank/viewAccountPortfolio.html"
  ) {
    throw new Error("An unknown login error has occurred"); // temp
  }
}

export const exportTransactions = async (
  page: Page,
  accountBsb: string,
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
): Promise<string> => {
  await page.goto(
    "https://ibanking.stgeorge.com.au/ibank/viewAccountPortfolio.html"
  );

  const bsbNumberElements = await page.$$(
    "#acctSummaryList > li > dl.account-number-details > dt.bsb-number + dd"
  );

  console.log(bsbNumberElements.length);

  const bsbNumbers = await Promise.all(
    bsbNumberElements.map(async (el) =>
      (
        await (await el.getProperty("textContent"))?.jsonValue<string>()
      )?.replace("-", "")
    )
  );

  console.log(bsbNumbers);

  const accountNumberElements = await page.$$(
    "#acctSummaryList > li > dl.account-number-details > dt.account-number + dd"
  );
  console.log(accountNumberElements.length);

  const accountNumbers = await Promise.all(
    accountNumberElements.map(async (el) =>
      (await (await el.getProperty("textContent"))?.jsonValue<string>())
        ?.replace(/\t/gi, "")
        .replace(/\n/gi, "")
        .replace(/\s/gi, "")
    )
  );

  console.log(accountNumbers);

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

  console.log(accounts);

  const accountIndex: number = accounts.findIndex(
    (a) => a.bsbNumber === accountBsb && a.accountNumber === accountNumber
  );

  console.log(accountIndex);

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

  // return "test.txt";

  // if (startDate !== undefined) {
  //   const startDateFormatted = format(startDate, "dd/MM/yyyy");

  //   if (options.debug)
  //     console.log(`Setting start date '${startDateFormatted}'`);

  //   await page.click("#DateRange_StartDate", { clickCount: 3 });
  //   await page.type("#DateRange_StartDate", startDateFormatted);
  // }

  // if (endDate !== undefined) {
  //   const endDateFormatted = format(endDate, "dd/MM/yyyy");

  //   if (options.debug) console.log(`Setting end date '${endDateFormatted}'`);

  //   await page.click("#DateRange_EndDate", { clickCount: 3 });
  //   await page.type("#DateRange_EndDate", endDateFormatted);
  // }

  // if (options.debug) console.log(`Selecting account '${accountName}'`);

  // await page.type("#Accounts_1", accountName);
  // await page.waitForTimeout(2000);
  // await page.waitForSelector(".autosuggest-suggestions:first-child");
  // await page.click(".autosuggest-suggestions:first-child");

  // const fileTypeSelector = getFileTypeSelector(exportFormat);

  // if (options.debug)
  //   console.log(`Setting export format '${ExportFormat[exportFormat]}'`);

  // await page.waitForTimeout(2000);
  // await page.waitForSelector(fileTypeSelector);
  // await page.click(fileTypeSelector);

  // let downloadDirectory = options.downloadDirectory;

  // if (downloadDirectory === undefined) {
  //   const tempDir = tmp.dirSync();
  //   downloadDirectory = tempDir.name;
  // } else {
  //   fs.mkdirSync(path.resolve(downloadDirectory));
  // }

  // if (options.debug)
  //   console.log(`Exporting transactions to '${downloadDirectory}'`);

  // const client = await page.target().createCDPSession();
  // await client.send("Page.setDownloadBehavior", {
  //   behavior: "allow",
  //   downloadPath: downloadDirectory,
  // });
  // await page.click(".btn-actions > .btn.export-link");

  // let transactionsFile = "";

  // const downloadTimeoutTime = addMilliseconds(
  //   new Date(),
  //   options.downloadTimeoutInMs || 300000 // 5 minutes
  // );

  // while (true) {
  //   if (options.debug)
  //     console.log(`Checking for downloaded file in '${downloadDirectory}'`);

  //   const downloadDirFiles = fs.readdirSync(downloadDirectory, {
  //     withFileTypes: true,
  //   });

  //   if (downloadDirFiles.length > 0) {
  //     downloadDirFiles.forEach((file) => {
  //       if (
  //         file.isFile() &&
  //         path.extname(file.name).toLowerCase() ==
  //           getFileExtension(exportFormat).toLowerCase()
  //       )
  //         transactionsFile = path.join(downloadDirectory || "", file.name);
  //     });

  //     break;
  //   }

  //   if (new Date() > downloadTimeoutTime) {
  //     throw new Error("Transaction file download has timed out");
  //   }

  //   await page.waitForTimeout(1000);
  // }

  // return transactionsFile;
};

export type StGeorgeTransactionExportInputs = {
  accessNumber: string;
  password: string;
  securityNumber: number;
  accountBsb: string;
  accountNumber: string;
  startDate?: Date;
  endDate?: Date;
  downloadDirectory?: string;
  debug?: boolean;
};

export class StGeorgeTransactionExporter
  implements
    ITransactionExporter<
      StGeorgeTransactionExportInputs,
      FileTransactionExportOutput
    >
{
  async export(
    inputs: StGeorgeTransactionExportInputs
  ): Promise<FileTransactionExportOutput> {
    const browser = await createBrowser();
    const page = await browser.newPage();

    await login(
      page,
      inputs.accessNumber,
      inputs.password,
      inputs.securityNumber
    );
    const filePath = await exportTransactions(
      page,
      inputs.accountBsb,
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
