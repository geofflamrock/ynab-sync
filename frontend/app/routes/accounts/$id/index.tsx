import { KeyIcon } from "@heroicons/react/24/outline";
import { NavLink, useOutletContext } from "@remix-run/react";
import { format, formatDistanceToNowStrict } from "date-fns";
import type { AccountDetail } from "~/../api";
import { BankLogo } from "~/components/bank/BankLogo";
import { getBankTitle } from "~/components/bank/BankTitle";
import { useRefreshOnInterval } from "~/components/hooks/useRefreshOnInterval";
import { Paper } from "~/components/layout/Paper";
import { DetailSection } from "~/components/primitive/DetailSection";
import { SubHeading } from "~/components/primitive/SubHeading";
import { SyncStatusWithLastSyncTime } from "~/components/sync/SyncStatus";
import { SyncStatusIcon } from "~/components/sync/SyncStatusIcon";
import { YnabIcon } from "~/components/ynab/YnabIcon";

export default function Account() {
  const account = useOutletContext<AccountDetail>();
  useRefreshOnInterval({ enabled: true, interval: 5000 });

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
      <div className="">
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
                  lastSyncTime={h.date}
                />
                <div className="ml-auto text-sm">
                  {h.status === "synced" && (
                    <span>
                      {h.transactionsCreatedCount?.toString() || "?"} created,{" "}
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
