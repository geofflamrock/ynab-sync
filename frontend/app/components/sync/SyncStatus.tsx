import { formatDistanceToNowStrict } from "date-fns";
import type { SyncStatus as Status } from "~/api/api";
import { SyncStatusIcon } from "./SyncStatusIcon";
import { SyncStatusTitle } from "./SyncStatusTitle";

type SyncStatusProps = {
  status: Status;
};

export const SyncStatus = ({ status }: SyncStatusProps) => {
  return (
    <div className="flex items-center gap-1">
      <SyncStatusIcon status={status} />
      <SyncStatusTitle status={status} />
    </div>
  );
};

type LastSyncTimeProps = {
  lastSyncTime?: Date;
};

export const TimeDivider = () => (
  <div className="h-1 w-1 rounded-full bg-gray-600 dark:bg-gray-400" />
);

export const LastSyncTime = ({ lastSyncTime }: LastSyncTimeProps) => {
  if (lastSyncTime === undefined) return null;

  return (
    <div className="text-sm text-gray-600 dark:text-gray-400">
      {formatDistanceToNowStrict(new Date(lastSyncTime), {
        addSuffix: true,
      })}
    </div>
  );
};

type SyncStatusWithLastSyncTimeProps = {
  status: Status;
  lastSyncTime?: Date;
};

export const SyncStatusWithLastSyncTime = ({
  status,
  lastSyncTime,
}: SyncStatusWithLastSyncTimeProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <SyncStatus status={status} />
      {lastSyncTime && <TimeDivider />}
      <LastSyncTime lastSyncTime={lastSyncTime} />
    </div>
  );
};
