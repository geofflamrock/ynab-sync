import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Form, useLocation, useSubmit } from "@remix-run/react";
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
    // <Form
    //   method="post"
    //   action={`/accounts/${accountId}/sync-now`}
    //   onSubmit={onSubmit}
    //   onSubmitCapture={onSubmit}
    // >
    <button
      className="rounded-full border-neutral-500 border-2 text-ynab pl-3 pr-4 py-2 hover:bg-neutral-700 flex gap-2 items-center text-sm"
      onClick={onClick}
    >
      <ArrowPathIcon className="h-4 w-4" />
      <span>Sync now</span>
    </button>
    // </Form>
  );
}
