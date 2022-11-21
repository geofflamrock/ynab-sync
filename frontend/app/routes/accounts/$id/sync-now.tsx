import type { ActionFunction } from "@remix-run/node";
import { json, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { formatISO, parseISO, sub, subDays } from "date-fns";
import invariant from "tiny-invariant";
import { syncNow } from "~/../api";
import { Paper } from "~/components/layout/Paper";
import { SubHeading } from "~/components/primitive/SubHeading";
import { Switch } from "@headlessui/react";
import { Fragment } from "react";

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.id, "Id must be provided");

  const id = parseInt(params.id);

  const formData = await request.formData();

  const startDateFormData = formData.get("startDate");
  invariant(
    startDateFormData && startDateFormData.valueOf(),
    "Start date must be provided"
  );
  const startDate = parseISO(startDateFormData.toString());

  const endDateFormData = formData.get("endDate");
  const endDate = endDateFormData
    ? parseISO(endDateFormData.toString())
    : undefined;

  const debugFormData = formData.get("debug");
  const debug: boolean = debugFormData
    ? debugFormData.toString().toLowerCase() === "true"
    : false;

  await syncNow(id, {
    debug,
    startDate,
    endDate,
  });

  const url = new URL(request.url);

  const returnLocation = url.searchParams.get("return");

  if (returnLocation) {
    return redirect(returnLocation);
  } else {
    return redirect(`/accounts/${id}`);
  }
};

export async function loader() {
  return json({
    startDate: formatISO(subDays(new Date(), 7), { representation: "date" }),
    endDate: formatISO(new Date(), { representation: "date" }),
    debug: false,
  });
}

export default function SyncNow() {
  const data = useLoaderData<typeof loader>();
  return (
    <Paper>
      <Form method="post" className="flex flex-col gap-4">
        <SubHeading title="Sync now" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="mx-1 text-sm">Start date</label>
            <input
              type="date"
              name="startDate"
              defaultValue={data.startDate}
              className="rounded-md p-2 dark:border dark:border-gray-600 dark:bg-gray-700 dark:focus:border-gray-500 dark:focus:ring-0"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="mx-1 text-sm">End date</label>
            <input
              type="date"
              name="endDate"
              defaultValue={data.endDate}
              className="rounded-md p-2 dark:border dark:border-gray-600 dark:bg-gray-700 dark:focus:border-gray-500 dark:focus:ring-0"
            />
          </div>
          <Switch.Group>
            <div className="flex items-center justify-between gap-2 md:justify-start">
              <Switch.Label className="mx-1 text-sm">Debug</Switch.Label>
              <Switch name="debug" value="true" as={Fragment}>
                {({ checked }) => (
                  /* Use the `checked` state to conditionally style the button. */
                  <button
                    className={`${
                      checked ? "bg-ynab" : "border border-gray-600 bg-gray-700"
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only text-sm">Debug</span>
                    <span
                      className={`${
                        checked ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </button>
                )}
              </Switch>
            </div>
          </Switch.Group>
        </div>
        <div>
          <button className="flex items-center gap-2 rounded-full bg-ynab py-2 pl-4 pr-4 text-sm text-ynab-800 hover:bg-ynab-200">
            Sync
          </button>
        </div>
      </Form>
    </Paper>
  );
}
