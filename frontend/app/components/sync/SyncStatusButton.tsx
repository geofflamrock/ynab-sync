import React from "react";
import {
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import type { SyncStatus } from "~/api/api";

export type SyncStatusButtonProps = {
  status: SyncStatus;
};

export function SyncStatusButton({ status }: SyncStatusButtonProps) {
  switch (status) {
    case "notsynced":
      return (
        <button className="rounded-full border-2 text-neutral-400 border-neutral-400 ml-auto py-2 px-4 flex gap-1 items-center text-sm hover:bg-neutral-400 hover:text-white group">
          <ArrowPathIcon className="w-4 h-4 mt-0.5" />
          <span>Never Synced</span>
        </button>
      );

    case "syncing":
      return (
        <button className="rounded-full border-2 text-ynab border-ynab ml-auto py-2 px-4 flex gap-1 items-center text-sm hover:bg-ynab hover:text-white group">
          <ArrowPathIcon className="w-4 h-4 mt-0.5 animate-spin" />
          <span>Syncing</span>
        </button>
      );

    case "queued":
      return (
        <button className="rounded-full border-2 text-ynab border-ynab ml-auto py-2 px-4 flex gap-1 items-center text-sm hover:bg-ynab hover:text-white group">
          <ArrowPathIcon className="w-4 h-4 mt-0.5" />
          <span>Queued</span>
        </button>
      );

    case "synced":
      return (
        <button className="rounded-full border-2 text-green-600 border-green-600 ml-auto py-2 px-4 flex gap-1 items-center text-sm hover:bg-green-600 hover:text-white group">
          <CheckIcon className="w-4 h-4 mt-0.5" />
          <span>Synced</span>
        </button>
      );

    case "error":
      return (
        <button className="rounded-full border-2 text-red-600 border-red-600 ml-auto py-2 px-4 flex gap-1 items-center hover:bg-red-600 hover:text-white group">
          <ExclamationTriangleIcon className="w-4 h-4 mt-0.5" />
          <span className="text-sm">Error</span>
        </button>
      );
  }
}
