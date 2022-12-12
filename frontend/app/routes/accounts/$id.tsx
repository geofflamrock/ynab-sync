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
import { BankLogo } from "~/components/bank/BankLogo";
import { YnabIcon } from "~/components/ynab/YnabIcon";

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
    <div className="flex flex-col gap-8 py-8">
      <div className="flex items-center justify-center gap-4">
        <div className="flex w-48 flex-col items-center justify-center gap-2">
          <BankLogo bank={account.bank} className="h-16 w-16" />
          <span className="text-lg text-gray-700 dark:text-gray-300">
            {account.bank.name}
          </span>
          <div className="flex flex-row gap-1 text-sm text-gray-500">
            {account.bank.fields.map((field) => (
              <span key={field.name}>{field.value}</span>
            ))}
          </div>
        </div>
        <SyncDirectionIcon className="h-10 w-10" />
        <div className="flex w-48 flex-col items-center justify-center gap-2">
          <YnabIcon className="h-16 w-16" />
          <span className="text-lg text-gray-700 dark:text-gray-300">
            {account.ynab.accountName}
          </span>
          <div className="text-sm text-gray-500">{account.ynab.budgetName}</div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col">
        <Outlet context={account} />
      </div>
    </div>
  );
}
