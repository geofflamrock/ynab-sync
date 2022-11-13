import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { NavLink, useLocation, useSubmit } from "@remix-run/react";
import React from "react";

type SyncNowButtonProps = {
  accountId: number;
};

export function SyncNowButton({ accountId }: SyncNowButtonProps) {
  const submit = useSubmit();
  const location = useLocation();

  function onClick(event: React.MouseEvent) {
    submit(null, {
      method: "post",
      action: `/accounts/${accountId}/sync-now?return=${location.pathname}`,
    });
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <NavLink to={`/accounts/${accountId}/sync-now`}>
      <button className="flex items-center gap-2 rounded-full border-0 border-neutral-600 py-2 pl-4 pr-4 text-sm text-ynab hover:bg-neutral-700">
        {/* <ArrowPathIcon className="h-4 w-4" /> */}
        <span>Sync now</span>
      </button>
    </NavLink>
  );
}
