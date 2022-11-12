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
import { SyncNowButton } from "~/components/sync/SyncNowButton";

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
            <SyncNowButton accountId={sync.id} />
          </div>
        </div>
      </ContentHeader>
      <div className="container mx-auto gap-4 grid grid-cols-2">
        <Paper className="flex flex-col gap-4">
          <SubHeading title="Bank" />
          <div className="flex flex-row gap-4">
            <div className="mt-2">
              <BankLogo bank={sync.bank} />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-1">
                  <BankTitle bank={sync.bank} />
                  <span className="text-sm text-neutral-500">Bank</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span>{sync.bank.accountName}</span>
                <span className="text-sm text-neutral-500">Account Name</span>
              </div>
              <div className="flex flex-col gap-1">
                <span>{sync.bank.bsbNumber}</span>
                <span className="text-sm text-neutral-500">BSB Number</span>
              </div>
              <div className="flex flex-col gap-1">
                <span>{sync.bank.accountNumber}</span>
                <span className="text-sm text-neutral-500">Account Number</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <KeyIcon className="w-8 h-8 mt-2" />
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-1">
                <span>6******4</span>
                <span className="text-sm text-neutral-500">Username</span>
              </div>
              <div className="flex flex-col gap-1">
                <span>********</span>
                <span className="text-sm text-neutral-500">Password</span>
              </div>
            </div>
          </div>
        </Paper>
        <Paper className="flex flex-col gap-4">
          <SubHeading title="YNAB" />
          <div className="flex flex-row gap-4">
            <div className="grid grid-cols-2 w-full">
              <div className="flex flex-row gap-4 items-center">
                <YnabIcon />
                <div className="flex flex-col gap-1">
                  <span>{sync.ynab.budgetName}</span>
                  <span className="text-sm text-neutral-500">Budget</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span>{sync.ynab.accountName}</span>
                <span className="text-sm text-neutral-500">Account</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <KeyIcon className="w-8 h-8 mt-2" />
            <div className="grid grid-cols-2 w-full">
              <div className="flex flex-col gap-1">
                <span>014d********</span>
                <span className="text-sm text-neutral-500">API Key</span>
              </div>
            </div>
          </div>
        </Paper>
      </div>
      <div className="container mx-auto gap-4 hidden">
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
