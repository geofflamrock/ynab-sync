import {
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { NavLink, useOutletContext } from "@remix-run/react";
import classNames from "classnames";
import { format, formatRelative } from "date-fns";
import { useState } from "react";
import type { AccountDetail } from "~/../api";
import { BankLogo } from "~/components/bank/BankLogo";
import { getBankTitle } from "~/components/bank/BankTitle";
import { useRefreshOnInterval } from "~/components/hooks/useRefreshOnInterval";
import { Paper } from "~/components/layout/Paper";
import { DetailSection } from "~/components/primitive/DetailSection";
import { SubHeading } from "~/components/primitive/SubHeading";
import { SyncNowButton } from "~/components/sync/SyncNowButton";
import {
  LastSyncTime,
  SyncStatusWithLastSyncTime,
} from "~/components/sync/SyncStatus";
import { SyncStatusIcon } from "~/components/sync/SyncStatusIcon";
import { SyncStatusTitle } from "~/components/sync/SyncStatusTitle";
import { YnabIcon } from "~/components/ynab/YnabIcon";
import cronstrue from "cronstrue";
import parser from "cron-parser";

type ExpandablePaperProps = {
  title: string;
  initiallyOpen?: boolean;
  children: React.ReactNode;
  className?: string;
};

function ExpandablePaper({
  title,
  initiallyOpen,
  children,
  className,
}: ExpandablePaperProps) {
  const [open, setOpen] = useState(initiallyOpen ?? false);

  return (
    <Paper className={classNames("flex flex-col p-0", className)}>
      <div className="flex cursor-pointer p-4" onClick={() => setOpen(!open)}>
        <SubHeading title={title} />
        <div className="ml-auto flex items-center">
          {open ? (
            <ChevronUpIcon className="h-6 w-6" />
          ) : (
            <ChevronDownIcon className="h-6 w-6" />
          )}
        </div>
      </div>
      {open && children}
    </Paper>
  );
}

type SummaryCardProps = {
  description: string;
  value: string;
};

function SummaryCard({ description, value }: SummaryCardProps) {
  return (
    <Paper className="flex h-48 w-48 flex-col items-center justify-evenly gap-8 p-8">
      <span className="text-center text-xl">{value}</span>
      <span className="text-center text-sm text-gray-500">{description}</span>
    </Paper>
  );
}

export default function Account() {
  const account = useOutletContext<AccountDetail>();
  useRefreshOnInterval({ enabled: true, interval: 5000 });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Paper className="flex h-48 w-48 flex-col items-center justify-around gap-4 p-8">
          <div className="flex flex-col items-center justify-center gap-1">
            <SyncStatusIcon status={account.status} size="xl" />
            <SyncStatusTitle status={account.status} />
            <LastSyncTime lastSyncTime={account.lastSyncTime} />
          </div>
          <SyncNowButton
            accountId={account.id}
            disabled={
              account.status === "queued" || account.status === "syncing"
            }
          />
        </Paper>
        <SummaryCard
          description="Next sync"
          value={
            account.schedule
              ? formatRelative(
                  parser
                    .parseExpression(account.schedule, {
                      currentDate: account.lastSyncTime,
                    })
                    .next()
                    .toDate(),
                  new Date()
                )
              : "No schedule"
          }
        />
        {account.maxTransactionDate && (
          <SummaryCard
            description="Synced to"
            value={format(new Date(account.maxTransactionDate), "PP")}
          />
        )}
        <SummaryCard
          description="Total synced"
          value={account.totalTransactionsSynced?.toString() ?? "0"}
        />
      </div>
      <div className="flex flex-col gap-4">
        <ExpandablePaper title="Details" initiallyOpen={true}>
          <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
            <DetailSection
              icon={<BankLogo bank={account.bank} className="mt-2" />}
              items={[
                { name: "Bank", value: getBankTitle(account.bank) },
                { name: "Account Name", value: account.bank.name },
                ...account.bank.fields.map((field) => {
                  return { name: field.displayName, value: field.value };
                }),
              ]}
            />
            <DetailSection
              icon={<YnabIcon className="mt-2" />}
              items={[
                { name: "Budget", value: account.ynab.budgetName },
                { name: "Account", value: account.ynab.accountName },
              ]}
            />
            <DetailSection
              icon={<ClockIcon className="mt-1 -ml-1 h-10 w-10" />}
              items={[
                {
                  name: "Schedule",
                  value: account.schedule
                    ? cronstrue.toString(account.schedule, { verbose: true })
                    : "Not set",
                },
              ]}
            />
          </div>
        </ExpandablePaper>
        <ExpandablePaper title="History" initiallyOpen={true}>
          <div className="flex flex-col pb-4">
            {account.history.map((h) => (
              <NavLink
                to={`history/${h.id}`}
                key={h.id}
                className="flex items-center gap-2 px-4 py-2 hover:dark:bg-gray-700"
              >
                <SyncStatusWithLastSyncTime
                  status={h.status}
                  lastSyncTime={h.lastUpdated}
                />
                <div className="ml-auto text-sm">
                  {h.status === "synced" && (
                    <span>
                      {h.transactionsCreatedCount?.toString() || "?"} new,{" "}
                      {h.transactionsUpdatedCount?.toString() || "?"} updated,{" "}
                      {h.transactionsUnchangedCount?.toString() || "?"} not
                      changed
                    </span>
                  )}
                </div>
              </NavLink>
            ))}
          </div>
        </ExpandablePaper>
      </div>
      <div className="grid hidden grid-cols-1 gap-4 lg:grid-cols-2">
        <Paper className="flex flex-col gap-4">
          <SubHeading title="Bank" />
          <DetailSection
            icon={<BankLogo bank={account.bank} className="mt-2" />}
            items={[
              { name: "Bank", value: getBankTitle(account.bank) },
              { name: "Account Name", value: account.bank.name },
              ...account.bank.fields.map((field) => {
                return { name: field.displayName, value: field.value };
              }),
            ]}
          />
          <DetailSection
            icon={<KeyIcon className="mt-2 h-8 w-8" />}
            items={account.bank.credentials.fields.map((field) => {
              return { name: field.displayName, value: "********" };
            })}
          />
        </Paper>
        <Paper className="flex flex-col gap-4">
          <SubHeading title="YNAB" />
          <DetailSection
            icon={<YnabIcon className="mt-2" />}
            items={[
              { name: "Budget", value: account.ynab.budgetName },
              { name: "Account", value: account.ynab.accountName },
            ]}
          />
          <DetailSection
            icon={<KeyIcon className="mt-2 h-8 w-8" />}
            items={[{ name: "API Key", value: "********" }]}
          />
        </Paper>
      </div>
      <div className="hidden">
        <Paper className="px-0 py-4">
          <SubHeading title="History" className="px-4 pb-2" />
          <div className="flex flex-col">
            {account.history.map((h) => (
              <NavLink
                to={`history/${h.id}`}
                key={h.id}
                className="flex items-center gap-2 px-4 py-2 hover:dark:bg-gray-700"
              >
                <SyncStatusWithLastSyncTime
                  status={h.status}
                  lastSyncTime={h.lastUpdated}
                />
                <div className="ml-auto text-sm">
                  {h.status === "synced" && (
                    <span>
                      {h.transactionsCreatedCount?.toString() || "?"} new,{" "}
                      {h.transactionsUpdatedCount?.toString() || "?"} updated,{" "}
                      {h.transactionsUnchangedCount?.toString() || "?"} not
                      changed
                    </span>
                  )}
                </div>
              </NavLink>
            ))}
          </div>
        </Paper>
      </div>
    </div>
  );
}
