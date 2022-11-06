import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { syncNow } from "~/api/api";

export const action: ActionFunction = async ({ params }) => {
  invariant(params.id, "Id must be provided");
  const id = parseInt(params.id);

  await syncNow(id);

  return redirect(`/accounts/${id}`);
};

export default function SyncNow() {
  return <div className="text-white">Syncing</div>;
}
