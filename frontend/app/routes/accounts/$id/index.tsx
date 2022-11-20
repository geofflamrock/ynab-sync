import { ClockIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useOutletContext } from "@remix-run/react";
import {
  format,
  formatDistanceToNow,
  setHours,
  addDays,
  formatRelative,
} from "date-fns";
import type { AccountDetail } from "~/api";
import { BankLogo } from "~/components/bank/BankLogo";
import { getBankTitle } from "~/components/bank/BankTitle";
import { Paper } from "~/components/layout/Paper";
import { DetailSection } from "~/components/primitive/DetailSection";
import { SubHeading } from "~/components/primitive/SubHeading";
import { SyncStatusIcon } from "~/components/sync/SyncStatusIcon";
import { YnabIcon } from "~/components/ynab/YnabIcon";

export default function Account() {
  const account = useOutletContext<AccountDetail>();
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = addDays(today, 1);
  const nextSyncTime = setHours(tomorrow, 10);

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
        <Paper className="flex flex-col gap-4">
          <SubHeading title="Sync" />
          <DetailSection
            icon={<ClockIcon className="mt-2 h-8 w-8" />}
            items={[
              { name: "Schedule", value: "Daily at 10am" },
              {
                name: "Next sync",
                value: formatRelative(nextSyncTime, new Date()),
              },
            ]}
          />
        </Paper>
      </div>
      <div className="hidden">
        <Paper>
          <SubHeading title="History" />
          <div className="flex flex-col">
            {account.history.map((h) => (
              <div
                key={h.id}
                className="flex items-center gap-4 rounded-lg py-2 text-gray-400"
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
    </div>
  );
}
