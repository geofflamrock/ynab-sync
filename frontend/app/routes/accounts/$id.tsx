import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { AccountDetail } from "~/../api";
import { getAccountDetail } from "~/../api";
import { ContentHeader } from "~/components/layout/ContentHeader";
import { Heading } from "~/components/primitive/Heading";
import { SyncDirectionIcon } from "~/components/accounts/SyncDirectionIcon";
import { YnabAccountSummary } from "~/components/accounts/YnabAccountSummary";
import { BankAccountSummary } from "~/components/accounts/BankAccountSummary";
import { SyncStatusWithLastSyncTime } from "~/components/sync/SyncStatus";
import classnames from "classnames";

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
  const account = useLoaderData<AccountDetail>();
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
          <BankAccountSummary account={account.bank} />
          <SyncDirectionIcon />
          <YnabAccountSummary account={account.ynab} />
          <div className="ml-auto flex flex-row items-center gap-2">
            <SyncStatusWithLastSyncTime
              status={account.status}
              lastSyncTime={
                account.lastSyncTime
                  ? new Date(account.lastSyncTime)
                  : undefined
              }
            />
            <NavLink
              to={`/accounts/${account.id}/sync-now`}
              className="hidden rounded-full bg-gray-100 px-4 py-2 text-sm text-ynab hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 lg:block"
            >
              Sync now
            </NavLink>
          </div>
        </div>
      </ContentHeader>
      <div className="container mx-auto flex flex-col gap-4">
        <div className="flex w-full justify-center gap-4 border-b-0 border-b-gray-500 px-0 md:justify-start">
          <NavLink
            to={`/accounts/${account.id}`}
            end
            className={({ isActive }) =>
              classnames(
                "px-2 py-2 text-sm text-gray-500 hover:text-gray-300",
                {
                  "border-b-2 border-b-ynab text-ynab hover:text-ynab":
                    isActive,
                }
              )
            }
          >
            Details
          </NavLink>
          <NavLink
            to={`/accounts/${account.id}/history`}
            className={({ isActive }) =>
              classnames(
                "py-2 px-2 text-sm text-gray-500 hover:text-gray-300",
                {
                  "border-b-2 border-b-ynab text-ynab hover:text-ynab":
                    isActive,
                }
              )
            }
          >
            History
          </NavLink>
        </div>
        <Outlet context={account} />
      </div>
    </div>
  );
}
