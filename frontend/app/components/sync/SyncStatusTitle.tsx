import { exhaustiveCheck } from "api/utils/exhaustiveCheck";
import classNames from "classnames";
import React from "react";
import type { SyncStatus } from "~/../api";

export type SyncStatusTitleProps = {
  status: SyncStatus;
  className?: string;
};

export function getSyncStatusTitle(status: SyncStatus) {
  switch (status) {
    case "error":
      return "Error";
    case "notsynced":
      return "Not synced";
    case "queued":
      return "Waiting to start";
    case "synced":
      return "Synced";
    case "syncing":
      return "Syncing";

    default:
      exhaustiveCheck(status, "Unknown status");
  }
}

export function SyncStatusTitle({ status, className }: SyncStatusTitleProps) {
  switch (status) {
    case "notsynced":
      return (
        <div
          className={classNames(
            "text-sm text-gray-600 dark:text-gray-400",
            className
          )}
        >
          {getSyncStatusTitle("notsynced")}
        </div>
      );

    case "syncing":
      return (
        <div className={classNames("text-sm text-ynab", className)}>
          {getSyncStatusTitle("syncing")}
        </div>
      );

    case "queued":
      return (
        <div
          className={classNames(
            "text-sm text-gray-600 dark:text-gray-400",
            className
          )}
        >
          {getSyncStatusTitle("queued")}
        </div>
      );

    case "synced":
      return (
        <div className={classNames("text-sm text-green-600", className)}>
          {getSyncStatusTitle("synced")}
        </div>
      );

    case "error":
      return (
        <div className={classNames("text-sm text-red-600", className)}>
          {getSyncStatusTitle("error")}
        </div>
      );
  }
}
