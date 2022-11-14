import { ClockIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useOutletContext } from "@remix-run/react";
import {
  format,
  formatDistanceToNow,
  setHours,
  addDays,
  formatRelative,
} from "date-fns";
import type { AccountDetail } from "~/api/api";
import { BankLogo } from "~/components/bank/BankLogo";
import { getBankTitle } from "~/components/bank/BankTitle";
import { Paper } from "~/components/layout/Paper";
import { DetailSection } from "~/components/primitive/DetailSection";
import { SubHeading } from "~/components/primitive/SubHeading";
import { SyncStatusIcon } from "~/components/sync/SyncStatusIcon";
import { YnabIcon } from "~/components/ynab/YnabIcon";

export default function Account() {
  const sync = useOutletContext<AccountDetail>();
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
            icon={<BankLogo bank={sync.bank} className="mt-2" />}
            items={[
              { name: "Bank", value: getBankTitle(sync.bank) },
              { name: "Account Name", value: sync.bank.accountName },
              { name: "BSB Number", value: sync.bank.bsbNumber },
              { name: "Account Number", value: sync.bank.accountNumber },
            ]}
          />
          <DetailSection
            icon={<KeyIcon className="mt-2 h-8 w-8" />}
            items={[
              { name: "Username", value: "65******" },
              { name: "Password", value: "********" },
            ]}
          />
        </Paper>
        <Paper className="flex flex-col gap-4">
          <SubHeading title="YNAB" />
          <DetailSection
            icon={<YnabIcon className="mt-2" />}
            items={[
              { name: "Budget", value: sync.ynab.budgetName },
              { name: "Account", value: sync.ynab.accountName },
            ]}
          />
          <DetailSection
            icon={<KeyIcon className="mt-2 h-8 w-8" />}
            items={[{ name: "API Key", value: "014d********" }]}
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
    </div>
  );
}
