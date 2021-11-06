import { format } from "date-fns";
import path from "path";
import tmp from "tmp";
import fs from "fs";

export enum ExportFormat {
  Ofx,
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

function getTransactionRequestFormat(exportFormat: ExportFormat): string {
  switch (exportFormat) {
    case ExportFormat.Ofx: {
      return "ofx";
    }
    default: {
      throw new Error("Unknown export format");
    }
  }
}

type IngDirectExportTransactionRequestBody = {
  "X-AuthToken": string;
  AccountNumber: string;
  Format: string;
  FilterStartDate?: string;
  FilterEndDate?: string;
  IsSpecific: boolean;
};

export const exportTransactions = async (
  authToken: string,
  accountNumber: string,
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
  let downloadDirectory = options.downloadDirectory;

  if (downloadDirectory === undefined) {
    const tempDir = tmp.dirSync();
    downloadDirectory = tempDir.name;
  } else {
    fs.mkdirSync(path.resolve(downloadDirectory));
  }

  if (options.debug)
    console.log(`Exporting transactions to '${downloadDirectory}'`);

  const requestBody: IngDirectExportTransactionRequestBody = {
    "X-AuthToken": authToken,
    AccountNumber: accountNumber,
    Format: getTransactionRequestFormat(exportFormat),
    IsSpecific: false,
    FilterEndDate:
      endDate !== undefined
        ? format(endDate, "YYYY-MM-DDTHH:mm:ssZZ")
        : undefined,
    FilterStartDate:
      startDate !== undefined
        ? format(startDate, "YYYY-MM-DDTHH:mm:ssZZ")
        : undefined,
  };

  const response = await fetch(
    "https://www.ing.com.au/api/ExportTransactions/Service/ExportTransactionsService.svc/json/ExportTransactions/ExportTransactions",
    {
      method: "POST",
      body: JSON.stringify(requestBody),
    }
  );

  const data = await response.json();

  const transactionsFile = path.join(
    downloadDirectory,
    `transactions${getFileExtension(exportFormat)}`
  );

  fs.writeFileSync(transactionsFile, data);

  return transactionsFile;
};
