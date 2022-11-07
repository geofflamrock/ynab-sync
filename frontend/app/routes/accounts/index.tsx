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
import { SyncStatusIcon } from "~/components/sync/SyncStatusIcon";
import { ContentHeader } from "../../components/layout/ContentHeader";

export async function loader() {
  return json(await getSyncDetails());
}

export default function Accounts() {
  const data = useLoaderData<Array<AccountDetail>>();
  useRefreshOnInterval({ enabled: true, interval: 10000 });

  return (
    <div className="flex flex-col">
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
        <Paper className="p-2">
          <div className="flex flex-col gap-2">
            {data.map((d) => {
              return (
                <NavLink
                  key={d.id}
                  to={`/accounts/${d.id}`}
                  className={({ isActive }) =>
                    classnames(
                      "grid grid-cols-12 items-center gap-8 rounded-lg text-neutral-400 hover:bg-neutral-700 p-2",
                      { "bg-neutral-200": isActive }
                    )
                  }
                >
                  <div className="xl:col-span-3 2xl:col-span-2 lg:col-span-4 col-span-5">
                    <BankAccountSummary account={d.bank} />
                  </div>
                  <div className="flex gap-4 2xl:col-span-10 items-center xl:col-span-9 lg:col-span-8 col-span-7">
                    <SyncDirectionIcon />
                    <YnabAccountSummary account={d.ynab} />
                    <div className="ml-auto">
                      <SyncStatusIcon status={d.status} />
                    </div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </Paper>
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
