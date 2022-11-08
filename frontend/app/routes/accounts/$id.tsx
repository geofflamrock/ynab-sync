import { ArrowPathIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { AccountDetail } from "~/api/api";
import { getAccountDetail } from "~/api/api";
import { SyncStatusIcon } from "~/components/sync/SyncStatusIcon";
import { format, formatDistanceToNow } from "date-fns";
import { ContentHeader } from "~/components/layout/ContentHeader";
import { Heading } from "~/components/primitive/Heading";
import {
  BankAccountSummary,
  SyncDirectionIcon,
  YnabAccountSummary,
} from "~/components/accounts/AccountSummary";
import { Paper } from "~/components/layout/Paper";
import { SubHeading } from "~/components/primitive/SubHeading";
import { useRefreshOnInterval } from "../../components/hooks/useRefreshOnInterval";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "Id must be provided");
  const id = parseInt(params.id);
  const sync = await getAccountDetail(id);

  if (!sync) throw new Response("Not Found", { status: 404 });

  return json(sync);
};

type SummaryCardProps = {
  key: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
};

function SummaryCard({ key, title, subtitle }: SummaryCardProps) {
  return (
    <div
      key={key}
      className="flex flex-col items-center justify-center gap-4 rounded-lg bg-neutral-800 p-8"
    >
      <div className="text-2xl text-neutral-300">{title}</div>
      {subtitle && <div className="text-md text-neutral-500">{subtitle}</div>}
    </div>
  );
}

export default function Sync() {
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
          <ChevronRightIcon className="h-4 w-4 text-neutral-500 hidden md:block" />
          <BankAccountSummary account={sync.bank} />
          <SyncDirectionIcon />
          <YnabAccountSummary account={sync.ynab} />
          <div className="ml-auto md:ml-0">
            <SyncStatusIcon status={sync.status} />
          </div>
          <div className="ml-auto hidden md:flex flex-row gap-2">
            <Form method="post" action="sync-now">
              <button
                className="rounded-full border-ynab border-2 text-ynab pl-3 pr-4 py-2 hover:text-white hover:bg-ynab flex gap-2 items-center"
                type="submit"
              >
                <ArrowPathIcon className="h-6 w-6" />
                <span>Sync Now</span>
              </button>
            </Form>
          </div>
        </div>
      </ContentHeader>

      <div className="container mx-auto">
        <Paper>
          <SubHeading title="History" />
          <div className="flex flex-col">
            {sync.history.map((h) => (
              <div
                key={h.id}
                className="flex items-center gap-4 rounded-lg py-2 text-neutral-400"
              >
                <SyncStatusIcon status={h.status} />
                <div title={format(new Date(h.date), "Pp")}>
                  {formatDistanceToNow(new Date(h.date), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        </Paper>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
