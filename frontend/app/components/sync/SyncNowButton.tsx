import { NavLink } from "@remix-run/react";

type SyncNowButtonProps = {
  accountId: number;
};

export function SyncNowButton({ accountId }: SyncNowButtonProps) {
  return (
    <NavLink to={`/accounts/${accountId}/sync-now`}>
      <button className="flex items-center gap-2 rounded-full border-0 border-gray-600 py-2 pl-4 pr-4 text-sm text-ynab hover:bg-gray-700">
        <span>Sync now</span>
      </button>
    </NavLink>
  );
}
