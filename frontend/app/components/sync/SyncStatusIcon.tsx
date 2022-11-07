import React from "react";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import type { SyncStatus } from "~/api/api";

export type SyncStatusIconProps = {
  status: SyncStatus;
};

export function SyncStatusIcon({ status }: SyncStatusIconProps) {
  switch (status) {
    case "notsynced":
      return <NoSymbolIcon className="mt-0.5 h-8 w-8 text-neutral-400" />;

    case "syncing":
      return (
        <ArrowPathIcon className="mt-0.5 h-8 w-8 animate-spin text-ynab" />
      );

    case "queued":
      return <QueueListIcon className="mt-0.5 h-8 w-8 text-neutral-400" />;

    case "synced":
      return <CheckCircleIcon className="mt-0.5 h-8 w-8 text-green-600" />;

    case "error":
      return (
        <ExclamationTriangleIcon className="mt-0.5 h-8 w-8 text-red-600" />
      );
  }
}
