import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import invariant from "tiny-invariant";
import { syncNow } from "~/api/api";
import { Paper } from "~/components/layout/Paper";

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.id, "Id must be provided");
  const id = parseInt(params.id);

  await syncNow(id);

  const url = new URL(request.url);

  const returnLocation = url.searchParams.get("return");

  console.log(returnLocation);

  if (returnLocation) {
    return redirect(returnLocation);
  } else {
    return redirect(`/accounts/${id}`);
  }
};

export default function SyncNow() {
  return (
    <Paper>
      <Form method="post">
        <button className="flex items-center gap-2 rounded-full bg-ynab py-2 pl-4 pr-4 text-sm text-ynab-800 hover:bg-ynab-200">
          Sync
        </button>
      </Form>
    </Paper>
  );
}
