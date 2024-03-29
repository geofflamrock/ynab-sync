import { formatISO, parseISO } from "date-fns";
import { readFile } from "fs/promises";
import { EOL } from "os";
import { prisma } from "../client";
import { pathExistsSync } from "fs-extra";
import type { TransactionImportResults } from "ynab-sync-core";
import { max, maxBy, min, minBy } from "lodash";

export type SyncStatus =
  | "notsynced"
  | "queued"
  | "syncing"
  | "synced"
  | "error";

export function getSyncStatus(status: string): SyncStatus {
  switch (status) {
    case "notsynced":
      return "notsynced";
    case "syncing":
      return "syncing";
    case "queued":
      return "queued";
    case "error":
      return "error";
    case "synced":
      return "synced";
    default:
      return "notsynced";
  }
}

export type LogLevel =
  | "fatal"
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "verbose";

export type SyncLogMessage = {
  level: LogLevel;
  message: string;
  timestamp: Date;
  [key: string]: any;
};

export type SyncDetailWithLogs = {
  id: number;
  status: SyncStatus;
  options: SyncOptions;
  transactionsCreatedCount?: number;
  transactionsUpdatedCount?: number;
  transactionsUnchangedCount?: number;
  minTransactionDate?: Date;
  maxTransactionDate?: Date;
  created: Date;
  lastUpdated: Date;
  logs: Array<SyncLogMessage>;
};

export async function getSyncDetail(
  syncId: number,
  levels: Array<LogLevel>
): Promise<SyncDetailWithLogs> {
  const sync = await prisma.sync.findUnique({
    where: {
      id: syncId,
    },
  });

  if (sync === null)
    throw new Error(`Sync with id ${syncId} could not be found`);

  const syncLogFilePath = `./Sync-${sync.id}.log`;

  const logs: Array<SyncLogMessage> = [];

  if (pathExistsSync(syncLogFilePath)) {
    const fileContents = (await readFile(syncLogFilePath)).toString();
    const logMessages = fileContents.split(EOL);
    for (const logMessage of logMessages) {
      if (logMessage) {
        const parsedLogMessage: SyncLogMessage = JSON.parse(logMessage);
        if (levels.includes(parsedLogMessage.level))
          logs.push(parsedLogMessage);
      }
    }
  }

  return {
    id: sync.id,
    status: getSyncStatus(sync.status),
    options: parseSyncOptions(sync.details),
    transactionsCreatedCount: sync.transactionsCreatedCount ?? undefined,
    transactionsUnchangedCount: sync.transactionsUnchangedCount ?? undefined,
    transactionsUpdatedCount: sync.transactionsUpdatedCount ?? undefined,
    minTransactionDate: sync.minTransactionDate ?? undefined,
    maxTransactionDate: sync.maxTransactionDate ?? undefined,
    created: sync.created,
    lastUpdated: sync.lastUpdated,
    logs,
  };
}

export type SyncOptions = {
  debug: boolean;
  startDate: Date;
  endDate?: Date;
};

export function formatSyncOptions(options: SyncOptions): string {
  const formattedOptions: SyncOptionsFormatted = {
    debug: options.debug,
    endDate: options.endDate
      ? formatISO(options.endDate, { representation: "date" })
      : undefined,
    startDate: formatISO(options.startDate, { representation: "date" }),
  };

  return JSON.stringify(formattedOptions);
}

type SyncOptionsFormatted = {
  debug: boolean;
  startDate: string;
  endDate?: string;
};

export function parseSyncOptions(options: string): SyncOptions {
  const formattedOptions: SyncOptionsFormatted = JSON.parse(options);

  return {
    debug: formattedOptions.debug,
    endDate: formattedOptions.endDate
      ? parseISO(formattedOptions.endDate)
      : undefined,
    startDate: parseISO(formattedOptions.startDate),
  };
}

export async function updateSuccessfulSync(
  syncId: number,
  importResults: TransactionImportResults
) {
  const minCreatedTransaction = minBy(
    importResults.transactionsCreated,
    (t) => t.date
  );
  const minUpdatedTransaction = minBy(
    importResults.transactionsUpdated,
    (t) => t.date
  );
  const minUnchangedTransaction = minBy(
    importResults.transactionsUnchanged,
    (t) => t.date
  );
  const minTransactionDate = min([
    minCreatedTransaction?.date,
    minUpdatedTransaction?.date,
    minUnchangedTransaction?.date,
  ]);
  const maxCreatedTransaction = maxBy(
    importResults.transactionsCreated,
    (t) => t.date
  );
  const maxUpdatedTransaction = maxBy(
    importResults.transactionsUpdated,
    (t) => t.date
  );
  const maxUnchangedTransaction = maxBy(
    importResults.transactionsUnchanged,
    (t) => t.date
  );
  const maxTransactionDate = max([
    maxCreatedTransaction?.date,
    maxUnchangedTransaction?.date,
    maxUpdatedTransaction?.date,
  ]);

  await prisma.sync.update({
    where: {
      id: syncId,
    },
    data: {
      status: "synced",
      lastUpdated: new Date(),
      transactionsCreatedCount: importResults.transactionsCreated.length,
      transactionsUnchangedCount: importResults.transactionsUnchanged.length,
      transactionsUpdatedCount: importResults.transactionsUpdated.length,
      minTransactionDate:
        minTransactionDate !== undefined
          ? parseISO(minTransactionDate)
          : undefined,
      maxTransactionDate:
        maxTransactionDate !== undefined
          ? parseISO(maxTransactionDate)
          : undefined,
    },
  });
}

export async function updateSync(syncId: number, status: SyncStatus) {
  await prisma.sync.update({
    where: {
      id: syncId,
    },
    data: {
      status: status,
      lastUpdated: new Date(),
    },
  });
}

export const syncNow = async (accountId: number, options: SyncOptions) => {
  const account = await prisma.account.findUnique({
    where: {
      id: accountId,
    },
    include: {
      bankAccount: true,
      bankCredentials: true,
      ynabAccount: {
        include: {
          budget: true,
        },
      },
      ynabCredentials: true,
    },
  });

  if (account === null) throw new Error("Could not find account details");

  const now = new Date();

  const sync = await prisma.sync.create({
    data: {
      accountId: account.id,
      status: "queued",
      created: now,
      lastUpdated: now,
      details: formatSyncOptions(options),
    },
  });

  return sync.id;
};

export async function getNextSync() {
  return await prisma.sync.findFirst({
    where: {
      status: "queued",
    },
    orderBy: {
      lastUpdated: "asc",
    },
    include: {
      account: {
        include: {
          bankAccount: true,
          bankCredentials: true,
          ynabAccount: {
            include: {
              budget: true,
            },
          },
          ynabCredentials: true,
        },
      },
    },
  });
}

export async function getInProgressSyncs() {
  return await prisma.sync.findMany({
    where: {
      status: "syncing",
    },
    orderBy: {
      lastUpdated: "asc",
    },
  });
}
