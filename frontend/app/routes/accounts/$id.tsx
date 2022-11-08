import {
  ArrowPathIcon,
  ChevronRightIcon,
  KeyIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
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
import { BankLogo } from "~/components/bank/BankLogo";
import { BankTitle } from "~/components/bank/BankTitle";
import { YnabIcon } from "~/components/ynab/YnabIcon";

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
                <span>Sync now</span>
              </button>
            </Form>
          </div>
        </div>
      </ContentHeader>

      <div className="container mx-auto gap-4 flex flex-col">
        <Paper className="flex flex-col gap-6">
          <div className="flex">
            <SubHeading title="Details" />
          </div>
          <div className="grid grid-cols-5">
            <div className="flex flex-row gap-4 items-center">
              <BankLogo bank={sync.bank} />
              <div className="flex flex-col">
                <BankTitle bank={sync.bank} />
                <span className="text-sm text-neutral-500">Bank</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span>{sync.bank.accountName}</span>
              <span className="text-sm text-neutral-500">Account Name</span>
            </div>
            <div className="flex flex-col">
              <span>{sync.bank.bsbNumber}</span>
              <span className="text-sm text-neutral-500">BSB Number</span>
            </div>
            <div className="flex flex-col">
              <span>{sync.bank.accountNumber}</span>
              <span className="text-sm text-neutral-500">Account Number</span>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2 items-center">
                <KeyIcon className="w-6 h-6" />
                <span>{sync.bank.credentialsName}</span>
              </div>
              <span className="text-sm text-neutral-500">Credentials</span>
            </div>
          </div>
          <div className="grid grid-cols-5">
            <div className="flex flex-row gap-4 items-center">
              <YnabIcon />
              <div className="flex flex-col">
                <span>{sync.ynab.budgetName}</span>
                <span className="text-sm text-neutral-500">Budget</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span>{sync.ynab.accountName}</span>
              <span className="text-sm text-neutral-500">Account</span>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2 items-center">
                <KeyIcon className="w-6 h-6" />
                <span>********</span>
              </div>
              <span className="text-sm text-neutral-500">Credentials</span>
            </div>
          </div>
        </Paper>
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
