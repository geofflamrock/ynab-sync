import {
  ArrowRightCircleIcon,
  ChevronRightIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { SyncDetail } from "~/api/api";
import { syncDetails } from "~/api/api";
import { BankLogo } from "~/components/bank/BankLogo";
import { SyncStatusButton } from "~/components/sync/SyncStatusButton";
import { SyncStatusIcon } from "~/components/sync/SyncStatusIcon";
import { YnabIcon } from "~/components/ynab/YnabIcon";
import { format, formatDistanceToNow } from "date-fns";
import { ContentHeader } from "~/components/layout/ContentHeader";
import { Heading } from "~/components/primitive/Heading";

export const loader: LoaderFunction = ({ params }) => {
  invariant(params.id, "Id must be provided");
  const id = parseInt(params.id);
  const sync = syncDetails.find((sync) => sync.id === id);

  return json(sync);
};

export default function Sync() {
  const sync = useLoaderData<SyncDetail>();
  return (
    <div className="flex flex-col gap-4">
      <ContentHeader>
        <div className="flex w-full items-center gap-4">
          <div>
            <Link to="/accounts">
              <Heading title="Accounts" />
            </Link>
          </div>
          <ChevronRightIcon className="h-4 w-4 text-neutral-500" />
          {/* <div> */}
          <BankLogo bank={sync.bank} />
          <div className="flex flex-col">
            <div className="text-md">{sync.bank.accountName}</div>
            <div className="flex text-sm text-neutral-500">
              {sync.bank.bsbNumber} {sync.bank.accountNumber}
            </div>
          </div>
          <ArrowRightCircleIcon className="h-6 w-6 text-neutral-500" />
          <YnabIcon />
          <div className="flex flex-col">
            <div className="text-md">{sync.ynab.accountName}</div>
            <div className="flex text-sm text-neutral-500">
              {sync.ynab.budgetName}
            </div>
          </div>
          <div className="ml-auto">
            <SyncStatusButton status={sync.status} />
          </div>
          {/* </div> */}
        </div>
      </ContentHeader>
      <div className="flex justify-evenly gap-4">
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-ynab p-8 text-white">
          <div className="text-4xl">412</div>
          <div>Transactions synced</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-ynab p-8 text-white">
          <div className="text-4xl">6 hours ago</div>
          <div>Last sync</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-ynab p-8 text-white">
          <div className="text-4xl">21st Oct 2022</div>
          <div>Synced up to</div>
        </div>
      </div>
      <div className="px-2 text-xl">History</div>
      <div className="flex flex-col">
        {sync.history.map((h) => (
          <Link
            to={`history/${h.id}`}
            key={h.id}
            className="flex items-center gap-4 rounded-lg py-2 px-2 hover:bg-neutral-100"
          >
            <SyncStatusIcon status={h.status} />
            <div title={format(new Date(h.date), "Pp")}>
              {formatDistanceToNow(new Date(h.date), { addSuffix: true })}
            </div>
            <div className="ml-auto flex gap-2 text-sm text-neutral-500">
              <div>
                {h.newRecordsCount} new, {h.updatedRecordsCount} updated,{" "}
                {h.unchangedRecordsCount} not changed
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
