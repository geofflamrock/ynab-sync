import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import classnames from "classnames";
import type { AccountDetail } from "~/api/api";
import { getSyncDetails } from "~/api/api";
import { syncDetails } from "~/api/api";
import {
  AccountSummary,
  BankAccountSummary,
  SyncDirectionIcon,
  YnabAccountSummary,
} from "~/components/accounts/AccountSummary";
import { useRefreshOnInterval } from "~/components/hooks/useRefreshOnInterval";
import { Heading } from "~/components/primitive/Heading";
import { SyncStatusIcon } from "~/components/sync/SyncStatusIcon";
import { ContentHeader } from "../../components/layout/ContentHeader";

export async function loader() {
  return json(await getSyncDetails());
}

export default function Accounts() {
  const data = useLoaderData<Array<AccountDetail>>();
  useRefreshOnInterval({ enabled: true, interval: 10000 });

  return (
    <div className="flex-col gap-2">
      {/* <div className="flex flex-col"> */}
      <ContentHeader>
        {/* <div className="flex items-center border-b-2 border-b-neutral-500 px-6 py-4"> */}
        <div className="flex w-full items-center">
          <Heading
            title="Accounts"
            // icon={<CreditCardIcon className="h-8 w-8" />}
          />
          <input
            type="text"
            placeholder="Search"
            className="ml-auto flex rounded-full border-0 bg-neutral-800 hover:bg-neutral-700 focus:bg-neutral-700 px-4 text-neutral-400 placeholder:text-neutral-600 hover:placeholder:text-neutral-500 focus:ring-0 focus:placeholder:text-neutral-400"
          ></input>
          {/* <button className="ml-auto rounded-full bg-ynab">
            <PlusCircleIcon className="h-6 w-6" />
            Add Account
          </button> */}
        </div>
        {/* </div> */}
      </ContentHeader>
      <div className="container mx-auto">
        {data.map((d) => {
          return (
            <NavLink
              key={d.id}
              to={`/accounts/${d.id}`}
              className={({ isActive }) =>
                classnames(
                  "flex items-center gap-8 rounded-lg p-2 text-neutral-400 hover:bg-neutral-800",
                  { "bg-neutral-200": isActive }
                )
              }
            >
              <div className="w-64">
                <BankAccountSummary account={d.bank} />
              </div>
              <SyncDirectionIcon />
              <YnabAccountSummary account={d.ynab} />
              <div className="ml-auto">
                <SyncStatusIcon status={d.status} />
              </div>
            </NavLink>
          );
        })}
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
