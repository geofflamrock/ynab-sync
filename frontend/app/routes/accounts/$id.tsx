import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { AccountDetail } from "~/api";
import { getAccountDetail } from "~/api";
import { ContentHeader } from "~/components/layout/ContentHeader";
import { Heading } from "~/components/primitive/Heading";
import { SyncDirectionIcon } from "~/components/accounts/SyncDirectionIcon";
import { YnabAccountSummary } from "~/components/accounts/YnabAccountSummary";
import { BankAccountSummary } from "~/components/accounts/BankAccountSummary";
import { useRefreshOnInterval } from "../../components/hooks/useRefreshOnInterval";
import { SyncStatusWithLastSyncTime } from "~/components/sync/SyncStatus";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "Id must be provided");
  const id = parseInt(params.id);
  const sync = await getAccountDetail(id);

  if (!sync) throw new Response("Not Found", { status: 404 });

  return json(sync);
};

export type DetailItem = {
  name: string;
  value: string;
};

export default function AccountLayout() {
  const sync = useLoaderData<AccountDetail>();
  useRefreshOnInterval({ enabled: true, interval: 5000 });
  return (
    <div className="flex flex-col">
      <ContentHeader>
        <div className="flex w-full items-center gap-4">
          <div className="hidden md:block">
            <Link to="/accounts">
              <Heading title="Accounts" />
            </Link>
          </div>
          <ChevronRightIcon className="hidden h-4 w-4 text-gray-500 md:block" />
          <BankAccountSummary account={sync.bank} />
          <SyncDirectionIcon />
          <YnabAccountSummary account={sync.ynab} />
          <div className="ml-auto flex flex-row items-center gap-2">
            <SyncStatusWithLastSyncTime
              status={sync.status}
              lastSyncTime={
                sync.lastSyncTime ? new Date(sync.lastSyncTime) : undefined
              }
            />
            <NavLink
              to={`/accounts/${sync.id}/sync-now`}
              className="hidden rounded-full bg-gray-100 px-4 py-2 text-sm text-ynab hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 lg:block"
            >
              Sync now
            </NavLink>
          </div>
        </div>
      </ContentHeader>
      <div className="container mx-auto">
        <Outlet context={sync} />
      </div>
    </div>
  );
}
