import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import classnames from "classnames";
import { formatDistanceToNow } from "date-fns";
import type { AccountDetail } from "~/api/api";
import { getSyncDetails } from "~/api/api";
import {
  BankAccountSummary,
  SyncDirectionIcon,
  YnabAccountSummary,
} from "~/components/accounts/AccountSummary";
import { useRefreshOnInterval } from "~/components/hooks/useRefreshOnInterval";
import { Paper } from "~/components/layout/Paper";
import { Heading } from "~/components/primitive/Heading";
import { SyncNowButton } from "~/components/sync/SyncNowButton";
import { SyncStatusIcon } from "~/components/sync/SyncStatusIcon";
import { SyncStatusTitle } from "~/components/sync/SyncStatusTitle";
import { ContentHeader } from "../../components/layout/ContentHeader";

export async function loader() {
  return json(await getSyncDetails());
}

export default function Accounts() {
  const data = useLoaderData<Array<AccountDetail>>();
  useRefreshOnInterval({ enabled: true, interval: 5000 });

  return (
    <div className="flex flex-col">
      <ContentHeader>
        <div className="flex w-full items-center gap-4">
          <Heading title="Accounts" />
          <div className="relative ml-auto text-neutral-400">
            <div className="pointer-events-none absolute flex h-10 w-10 items-center justify-center">
              <MagnifyingGlassIcon className="h-5 w-5 stroke-neutral-600" />
            </div>
            <input
              type="text"
              placeholder="Search accounts"
              className="h-10 rounded-full border-2 border-neutral-600 bg-neutral-800 px-4 pl-10 text-sm text-neutral-400 placeholder:text-neutral-600 hover:bg-neutral-700 hover:placeholder:text-neutral-500 focus:border-neutral-600 focus:bg-neutral-700 focus:ring-0 focus:placeholder:text-neutral-400"
            />
          </div>
        </div>
      </ContentHeader>
      <div className="container mx-auto gap-2">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {data.map((d) => {
            return (
              <Paper className="p-0" key={d.id}>
                <NavLink
                  key={d.id}
                  to={`/accounts/${d.id}`}
                  className={({ isActive }) =>
                    classnames(
                      "flex flex-col gap-4 rounded-lg p-4 text-neutral-400",
                      { "bg-neutral-200": isActive }
                    )
                  }
                >
                  <div className="flex items-center gap-4">
                    <BankAccountSummary account={d.bank} />
                    <SyncDirectionIcon />
                    <YnabAccountSummary account={d.ynab} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <SyncStatusIcon status={d.status} />
                      <SyncStatusTitle status={d.status} />
                    </div>
                    <div className="h-1 w-1 rounded-full bg-neutral-400"></div>
                    {d.lastSyncTime && (
                      <div className="text-sm">
                        {formatDistanceToNow(new Date(d.lastSyncTime), {
                          addSuffix: true,
                        })}
                      </div>
                    )}
                  </div>
                  <div className="-ml-3 flex items-center">
                    <SyncNowButton accountId={d.id} />
                  </div>
                </NavLink>
              </Paper>
            );
          })}
        </div>
      </div>
      {/* </div> */}
      {/* <Link
        to="/accounts/new"
        className="flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-neutral-300 p-4 text-neutral-500 hover:border-neutral-400 hover:text-neutral-700"
      >
        <PlusCircleIcon className="h-6 w-6" />
        Add New Account
      </Link> */}
    </div>
  );
}
