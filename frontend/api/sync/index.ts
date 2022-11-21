import { format, formatISO, parse, parseISO } from "date-fns";
import { prisma } from "../client";

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

  await prisma.sync.create({
    data: {
      accountId: account.id,
      status: "queued",
      date: new Date(),
      details: formatSyncOptions(options),
    },
  });

  await prisma.account.update({
    where: {
      id: account.id,
    },
    data: {
      syncStatus: "queued",
      lastSyncTime: new Date(),
    },
  });
};

export async function getNextSync() {
  return await prisma.sync.findFirst({
    where: {
      status: "queued",
    },
    orderBy: {
      date: "asc",
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
      date: "asc",
    },
  });
}
