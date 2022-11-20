import type {
  BankAccountDetail,
  BankAccountSummary as BankAccountSummaryApi,
} from "~/api";
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
        <div className="text-gray-700 dark:text-gray-300">{bank.name}</div>
        <div className="flex flex-row gap-1 text-sm text-gray-500">
          {bank.fields.map((field) => (
            <span key={field.name}>{field.value}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
