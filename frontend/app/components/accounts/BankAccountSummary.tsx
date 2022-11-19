import { BankAccountDetail } from "~/api/api";
import { BankAccountSummary as BankAccountSummaryApi } from "~/api/accountSummary";
import { BankLogo } from "../bank/BankLogo";

export function BankAccountSummary({
  account: bank,
}: {
  account: BankAccountDetail | BankAccountSummaryApi;
}) {
  return (
    <div className="flex items-center gap-4">
      <BankLogo bank={bank} />
      <div className="flex flex-col">
        <div className="text-gray-700 dark:text-gray-300">
          {bank.accountName}
        </div>
        <div className="text-sm text-gray-500">
          {bank.bsbNumber} {bank.accountNumber}
        </div>
      </div>
    </div>
  );
}
