import classNames from "classnames";
import React from "react";
import type { SyncStatus } from "~/../api";

export type SyncStatusTitleProps = {
  status: SyncStatus;
  className?: string;
};

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
          Not Synced
        </div>
      );

    case "syncing":
      return (
        <div className={classNames("text-sm text-ynab", className)}>
          Syncing
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
          Queued
        </div>
      );

    case "synced":
      return (
        <div className={classNames("text-sm text-green-600", className)}>
          Synced
        </div>
      );

    case "error":
      return (
        <div className={classNames("text-sm text-red-600", className)}>
          Error
        </div>
      );
  }
}
