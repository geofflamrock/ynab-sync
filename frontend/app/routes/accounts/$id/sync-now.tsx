import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { syncNow } from "~/api/api";

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
  return <div className="text-white">Syncing</div>;
}
