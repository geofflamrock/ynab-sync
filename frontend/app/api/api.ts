import { sub } from "date-fns";

export type WestpacSyncDetail = {
  type: "westpac";
  accountName: string;
  bsbNumber: string;
  accountNumber: string;
};

export type StGeorgeSyncDetail = {
  type: "stgeorge";
  accountName: string;
  bsbNumber: string;
  accountNumber: string;
};

export type SupportedBanks = WestpacSyncDetail | StGeorgeSyncDetail;

export type SyncYnabDetail = {
  budgetId: string;
  budgetName: string;
  accountId: string;
  accountName: string;
};

export type SyncStatus =
  | "notsynced"
  | "queued"
  | "syncing"
  | "synced"
  | "error";

export type SyncHistory = {
  id: number;
  status: SyncStatus;
  date: Date;
  newRecordsCount: number;
  updatedRecordsCount: number;
  unchangedRecordsCount: number;
};

export type SyncDetail = {
  id: number;
  bank: SupportedBanks;
  ynab: SyncYnabDetail;
  status: SyncStatus;
  history: Array<SyncHistory>;
};

export const syncDetails: Array<SyncDetail> = [
  {
    id: 1,
    bank: {
      type: "westpac",
      accountNumber: "12345678",
      bsbNumber: "123-456",
      accountName: "Transaction",
    },
    ynab: {
      budgetId: "123",
      budgetName: "Lamrock",
      accountId: "123",
      accountName: "Transaction",
    },
    status: "notsynced",
    history: [
      {
        id: 1,
        status: "synced",
        date: sub(new Date(), { hours: 6 }),
        newRecordsCount: 0,
        unchangedRecordsCount: 15,
        updatedRecordsCount: 2,
      },
      {
        id: 2,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 1 }),
        newRecordsCount: 3,
        unchangedRecordsCount: 12,
        updatedRecordsCount: 0,
      },
      {
        id: 3,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 2 }),
        newRecordsCount: 10,
        unchangedRecordsCount: 6,
        updatedRecordsCount: 1,
      },
      {
        id: 4,
        status: "error",
        date: sub(new Date(), { hours: 6, days: 2 }),
        newRecordsCount: 12,
        unchangedRecordsCount: 4,
        updatedRecordsCount: 6,
      },
      {
        id: 5,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 3 }),
        newRecordsCount: 0,
        unchangedRecordsCount: 7,
        updatedRecordsCount: 0,
      },
    ],
  },
  {
    id: 2,
    bank: {
      type: "westpac",
      accountNumber: "123",
      bsbNumber: "123",
      accountName: "Danz Work",
    },
    ynab: {
      budgetId: "123",
      budgetName: "Lamrock",
      accountId: "123",
      accountName: "Danz Work",
    },
    status: "syncing",
    history: [
      {
        id: 1,
        status: "synced",
        date: sub(new Date(), { hours: 6 }),
        newRecordsCount: 0,
        unchangedRecordsCount: 15,
        updatedRecordsCount: 2,
      },
      {
        id: 2,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 1 }),
        newRecordsCount: 3,
        unchangedRecordsCount: 12,
        updatedRecordsCount: 0,
      },
      {
        id: 3,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 2 }),
        newRecordsCount: 10,
        unchangedRecordsCount: 6,
        updatedRecordsCount: 1,
      },
      {
        id: 4,
        status: "error",
        date: sub(new Date(), { hours: 6, days: 2 }),
        newRecordsCount: 12,
        unchangedRecordsCount: 4,
        updatedRecordsCount: 6,
      },
      {
        id: 5,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 3 }),
        newRecordsCount: 0,
        unchangedRecordsCount: 7,
        updatedRecordsCount: 0,
      },
    ],
  },
  {
    id: 3,
    bank: {
      type: "stgeorge",
      accountNumber: "123",
      bsbNumber: "123",
      accountName: "Home Loan - Fixed",
    },
    ynab: {
      budgetId: "123",
      budgetName: "Lamrock",
      accountId: "123",
      accountName: "Home Loan - St George - Fixed",
    },
    status: "queued",
    history: [
      {
        id: 1,
        status: "synced",
        date: sub(new Date(), { hours: 6 }),
        newRecordsCount: 0,
        unchangedRecordsCount: 15,
        updatedRecordsCount: 2,
      },
      {
        id: 2,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 1 }),
        newRecordsCount: 3,
        unchangedRecordsCount: 12,
        updatedRecordsCount: 0,
      },
      {
        id: 3,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 2 }),
        newRecordsCount: 10,
        unchangedRecordsCount: 6,
        updatedRecordsCount: 1,
      },
      {
        id: 4,
        status: "error",
        date: sub(new Date(), { hours: 6, days: 2 }),
        newRecordsCount: 12,
        unchangedRecordsCount: 4,
        updatedRecordsCount: 6,
      },
      {
        id: 5,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 3 }),
        newRecordsCount: 0,
        unchangedRecordsCount: 7,
        updatedRecordsCount: 0,
      },
    ],
  },
  {
    id: 4,
    bank: {
      type: "stgeorge",
      accountNumber: "123",
      bsbNumber: "123",
      accountName: "Home Loan - Offset",
    },
    ynab: {
      budgetId: "123",
      budgetName: "Lamrock",
      accountId: "123",
      accountName: "Home Loan Offset",
    },
    status: "synced",
    history: [
      {
        id: 1,
        status: "synced",
        date: sub(new Date(), { hours: 6 }),
        newRecordsCount: 0,
        unchangedRecordsCount: 15,
        updatedRecordsCount: 2,
      },
      {
        id: 2,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 1 }),
        newRecordsCount: 3,
        unchangedRecordsCount: 12,
        updatedRecordsCount: 0,
      },
      {
        id: 3,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 2 }),
        newRecordsCount: 10,
        unchangedRecordsCount: 6,
        updatedRecordsCount: 1,
      },
      {
        id: 4,
        status: "error",
        date: sub(new Date(), { hours: 6, days: 2 }),
        newRecordsCount: 12,
        unchangedRecordsCount: 4,
        updatedRecordsCount: 6,
      },
      {
        id: 5,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 3 }),
        newRecordsCount: 0,
        unchangedRecordsCount: 7,
        updatedRecordsCount: 0,
      },
    ],
  },
  {
    id: 5,
    bank: {
      type: "stgeorge",
      accountNumber: "123",
      bsbNumber: "123",
      accountName: "Home Loan - Variable",
    },
    ynab: {
      budgetId: "123",
      budgetName: "Lamrock",
      accountId: "123",
      accountName: "Home Loan - St George - Variable",
    },
    status: "error",
    history: [
      {
        id: 1,
        status: "synced",
        date: sub(new Date(), { hours: 6 }),
        newRecordsCount: 0,
        unchangedRecordsCount: 15,
        updatedRecordsCount: 2,
      },
      {
        id: 2,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 1 }),
        newRecordsCount: 3,
        unchangedRecordsCount: 12,
        updatedRecordsCount: 0,
      },
      {
        id: 3,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 2 }),
        newRecordsCount: 10,
        unchangedRecordsCount: 6,
        updatedRecordsCount: 1,
      },
      {
        id: 4,
        status: "error",
        date: sub(new Date(), { hours: 6, days: 2 }),
        newRecordsCount: 12,
        unchangedRecordsCount: 4,
        updatedRecordsCount: 6,
      },
      {
        id: 5,
        status: "synced",
        date: sub(new Date(), { hours: 6, days: 3 }),
        newRecordsCount: 0,
        unchangedRecordsCount: 7,
        updatedRecordsCount: 0,
      },
    ],
  },
];
