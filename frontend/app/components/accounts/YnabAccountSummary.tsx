import type {
  YnabAccountDetail,
  YnabAccountSummary as YnabAccountSummaryApi,
} from "~/../api";
import { YnabIcon } from "../ynab/YnabIcon";

export function YnabAccountSummary({
  account: ynabAccount,
}: {
  account: YnabAccountDetail | YnabAccountSummaryApi;
}) {
  return (
    <div className="flex items-center gap-4">
      <YnabIcon />
      <div className="flex flex-col">
        <div className="text-gray-700 dark:text-gray-300">
          {ynabAccount.accountName}
        </div>
        <div className="text-sm text-gray-500">{ynabAccount.budgetName}</div>
      </div>
    </div>
  );
}
