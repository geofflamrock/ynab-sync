import React from "react";
import {
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import type { SyncStatus } from "~/../api";

export type SyncStatusButtonProps = {
  status: SyncStatus;
};

export function SyncStatusButton({ status }: SyncStatusButtonProps) {
  switch (status) {
    case "notsynced":
      return (
        <button className="group ml-auto flex items-center gap-1 rounded-full border-2 border-gray-400 py-2 px-4 text-sm text-gray-400 hover:bg-gray-400 hover:text-white">
          <ArrowPathIcon className="mt-0.5 h-4 w-4" />
          <span>Never Synced</span>
        </button>
      );

    case "syncing":
      return (
        <button className="group ml-auto flex items-center gap-1 rounded-full border-2 border-ynab py-2 px-4 text-sm text-ynab hover:bg-ynab hover:text-white">
          <ArrowPathIcon className="mt-0.5 h-4 w-4 animate-spin" />
          <span>Syncing</span>
        </button>
      );

    case "queued":
      return (
        <button className="group ml-auto flex items-center gap-1 rounded-full border-2 border-ynab py-2 px-4 text-sm text-ynab hover:bg-ynab hover:text-white">
          <ArrowPathIcon className="mt-0.5 h-4 w-4" />
          <span>Queued</span>
        </button>
      );

    case "synced":
      return (
        <button className="group ml-auto flex items-center gap-1 rounded-full border-2 border-green-600 py-2 px-4 text-sm text-green-600 hover:bg-green-600 hover:text-white">
          <CheckIcon className="mt-0.5 h-4 w-4" />
          <span>Synced</span>
        </button>
      );

    case "error":
      return (
        <button className="group ml-auto flex items-center gap-1 rounded-full border-2 border-red-600 py-2 px-4 text-red-600 hover:bg-red-600 hover:text-white">
          <ExclamationTriangleIcon className="mt-0.5 h-4 w-4" />
          <span className="text-sm">Error</span>
        </button>
      );
  }
}
