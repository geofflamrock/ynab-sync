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

export const syncNow = async (id: number) => {
  const account = await prisma.account.findUnique({
    where: {
      id: id,
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
