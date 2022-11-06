import React from "react";
import type { SyncStatus } from "~/api/api";

export type SyncStatusTitleProps = {
  status: SyncStatus;
};

export function SyncStatusTitle({ status }: SyncStatusTitleProps) {
  switch (status) {
    case "notsynced":
      return <div>Not Synced</div>;

    case "syncing":
      return <div>Syncing</div>;

    case "queued":
      return <div>Queued</div>;

    case "synced":
      return <div>Synced</div>;

    case "error":
      return <div>Error</div>;
  }
}
