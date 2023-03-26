import React from "react";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import type { SyncStatus } from "~/../api";
import classnames from "classnames";

export type SyncStatusIconProps = {
  status: SyncStatus;
  size?: "sm" | "lg" | "xl" | "2xl";
  className?: string;
};

export function SyncStatusIcon({
  status,
  size,
  className,
}: SyncStatusIconProps) {
  const baseClassName = classnames(
    {
      "h-6 w-6": size === undefined || size === "sm",
      "h-8 w-8": size === "lg",
      "h-12 w-12": size === "xl",
      "h-16 w-16": size === "2xl",
    },
    className
  );
  switch (status) {
    case "notsynced":
      return (
        <NoSymbolIcon
          className={classnames(baseClassName, "text-gray-400")}
          title="Never synced"
        />
      );

    case "syncing":
      return (
        <ArrowPathIcon
          className={classnames(baseClassName, "animate-spin text-ynab")}
          title="Syncing transactions"
        />
      );

    case "queued":
      return (
        <QueueListIcon
          className={classnames(baseClassName, "text-gray-400")}
          title="Sync queued"
        />
      );

    case "synced":
      return (
        <CheckCircleIcon
          className={classnames(baseClassName, "text-green-600")}
          title="Synced"
        />
      );

    case "error":
      return (
        <ExclamationTriangleIcon
          className={classnames(baseClassName, "text-red-600")}
          title="Error syncing transactions"
        />
      );
  }
}
