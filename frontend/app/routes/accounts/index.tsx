import {
  CreditCardIcon,
  ArrowRightCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { json } from "@remix-run/node";
import { Link, NavLink, useLoaderData } from "@remix-run/react";
import classnames from "classnames";
import React from "react";
import type { SyncDetail } from "~/api/api";
import { syncDetails } from "~/api/api";
import { BankLogo } from "~/components/bank/BankLogo";
import { Heading } from "~/components/primitive/Heading";
import { SyncStatusIcon } from "~/components/sync/SyncStatusIcon";
import { YnabIcon } from "~/components/ynab/YnabIcon";
import { ContentHeader } from "../../components/layout/ContentHeader";

export function loader() {
  return json(syncDetails);
}

export default function Accounts() {
  const data = useLoaderData<Array<SyncDetail>>();

  return (
    <div className="flex h-screen grow flex-col gap-2">
      {/* <div className="flex flex-col"> */}
      <ContentHeader>
        {/* <div className="flex items-center border-b-2 border-b-neutral-500 px-6 py-4"> */}
        <div className="flex w-full items-center">
          <Heading
            title="Accounts"
            icon={<CreditCardIcon className="h-8 w-8" />}
          />
          <input
            type="text"
            placeholder="Search"
            className="ml-auto rounded-full border border-neutral-200 bg-neutral-100 px-4 text-neutral-700 placeholder:text-neutral-400 hover:border-neutral-400 hover:placeholder:text-neutral-500 focus:border-neutral-400 focus:ring-0 focus:placeholder:text-neutral-500"
          />
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
                  "flex items-center gap-8 rounded-lg border border-transparent p-4 hover:border-neutral-200 hover:bg-white",
                  { "bg-neutral-200": isActive }
                )
              }
            >
              <div className="flex w-64 items-center gap-4">
                <BankLogo bank={d.bank} />
                <div className="flex flex-col">
                  <div>{d.bank.accountName}</div>
                  <div className="text-sm text-neutral-500">
                    {d.bank.bsbNumber} {d.bank.accountNumber}
                  </div>
                </div>
              </div>
              <ArrowRightCircleIcon className="h-6 w-6 text-neutral-500" />
              <div className="flex items-center gap-4">
                <YnabIcon />
                <div className="flex flex-col">
                  <div>{d.ynab.accountName}</div>
                  <div className="text-sm text-neutral-500">
                    {d.ynab.budgetName}
                  </div>
                </div>
              </div>
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
