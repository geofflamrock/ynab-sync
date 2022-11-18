import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import classnames from "classnames";
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
import { SyncStatusWithLastSyncTime } from "~/components/sync/SyncStatus";
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
          <div className="relative ml-auto hidden text-gray-400">
            <div className="pointer-events-none absolute flex h-10 w-10 items-center justify-center">
              <MagnifyingGlassIcon className="h-5 w-5 stroke-gray-600" />
            </div>
            <input
              type="text"
              placeholder="Search accounts"
              className="h-10 rounded-full border-0 border-gray-600 bg-gray-800 px-4 pl-10 text-sm text-gray-400 placeholder:text-gray-600 hover:bg-gray-700 hover:placeholder:text-gray-500 focus:border-gray-600 focus:bg-gray-700 focus:ring-0 focus:placeholder:text-gray-400"
            />
          </div>
        </div>
      </ContentHeader>
      <div className="container mx-auto gap-2">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {data.map((d) => {
            return (
              <Paper key={d.id}>
                <NavLink
                  key={d.id}
                  to={`/accounts/${d.id}`}
                  className="text flex flex-col gap-4 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <BankAccountSummary account={d.bank} />
                    <SyncDirectionIcon />
                    <YnabAccountSummary account={d.ynab} />
                  </div>
                  <div className="flex items-center gap-2">
                    <SyncStatusWithLastSyncTime
                      status={d.status}
                      lastSyncTime={
                        d.lastSyncTime ? new Date(d.lastSyncTime) : undefined
                      }
                    />
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
    </div>
  );
}
