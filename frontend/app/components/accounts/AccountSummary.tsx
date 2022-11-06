import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import type {
  SupportedBanks as BankAccounts,
  AccountDetail,
  SyncYnabDetail,
} from "~/api/api";
import { BankLogo } from "../bank/BankLogo";
import { SyncStatusIcon } from "../sync/SyncStatusIcon";
import { YnabIcon } from "../ynab/YnabIcon";

export function BankAccountSummary({
  account: bank,
}: {
  account: BankAccounts;
}) {
  return (
    <div className="flex items-center gap-4">
      <BankLogo bank={bank} />
      <div className="flex flex-col">
        <div className="text-neutral-400">{bank.accountName}</div>
        <div className="text-sm text-neutral-500">
          {bank.bsbNumber} {bank.accountNumber}
        </div>
      </div>
    </div>
  );
}

export function YnabAccountSummary({
  account: ynabAccount,
}: {
  account: SyncYnabDetail;
}) {
  return (
    <div className="flex items-center gap-4">
      <YnabIcon />
      <div className="flex flex-col">
        <div className="text-neutral-400">{ynabAccount.accountName}</div>
        <div className="text-sm text-neutral-500">{ynabAccount.budgetName}</div>
      </div>
    </div>
  );
}

export function SyncDirectionIcon() {
  return <ArrowRightCircleIcon className="h-6 w-6 text-neutral-500" />;
}

export function AccountSummary({
  account,
}: {
  account: Omit<AccountDetail, "history">;
}) {
  return (
    <div className="flex gap-8 items-center" key={account.id}>
      <BankAccountSummary account={account.bank} />
      <SyncDirectionIcon />
      <YnabAccountSummary account={account.ynab} />
      <div className="ml-auto">
        <SyncStatusIcon status={account.status} />
      </div>
    </div>
  );
}
