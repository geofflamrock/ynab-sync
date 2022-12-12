import { NavLink } from "@remix-run/react";
import classNames from "classnames";

type SyncNowButtonProps = {
  accountId: number;
  disabled?: boolean;
};

export function SyncNowButton({ accountId, disabled }: SyncNowButtonProps) {
  return (
    <NavLink
      to={`/accounts/${accountId}/sync-now`}
      className={classNames({ "pointer-events-none": disabled })}
    >
      <div
        className={classNames(
          "flex items-center gap-2 rounded-full py-2 pl-4 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
          { "text-gray-500": disabled, "text-ynab": !disabled }
        )}
      >
        <span>Sync now</span>
      </div>
    </NavLink>
  );
}
