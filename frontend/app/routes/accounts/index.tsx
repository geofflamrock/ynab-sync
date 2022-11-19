import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import type { AccountSummary } from "~/api/accountSummary";
import { getAccountSummaries } from "~/api/api";
import { SyncDirectionIcon } from "~/components/accounts/SyncDirectionIcon";
import { YnabAccountSummary } from "~/components/accounts/YnabAccountSummary";
import { BankAccountSummary } from "~/components/accounts/BankAccountSummary";
import { useRefreshOnInterval } from "~/components/hooks/useRefreshOnInterval";
import { Paper } from "~/components/layout/Paper";
import { Heading } from "~/components/primitive/Heading";
import { SyncNowButton } from "~/components/sync/SyncNowButton";
import { SyncStatusWithLastSyncTime } from "~/components/sync/SyncStatus";
import { ContentHeader } from "../../components/layout/ContentHeader";

export async function loader() {
  return json(await getAccountSummaries());
}

export default function Accounts() {
  const accounts = useLoaderData<Array<AccountSummary>>();
  useRefreshOnInterval({ enabled: true, interval: 5000 });

  return (
    <div className="flex flex-col">
      <ContentHeader>
        <div className="flex w-full items-center gap-4">
          <Heading title="Accounts" />
        </div>
      </ContentHeader>
      <div className="container mx-auto gap-2">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => {
            return (
              <Paper key={account.id}>
                <NavLink
                  key={account.id}
                  to={`/accounts/${account.id}`}
                  className="text flex flex-col gap-4 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <BankAccountSummary account={account.bankAccount} />
                    <SyncDirectionIcon />
                    <YnabAccountSummary account={account.ynabAccount} />
                  </div>
                  <div className="flex items-center gap-2">
                    <SyncStatusWithLastSyncTime
                      status={account.status}
                      lastSyncTime={
                        account.lastSyncTime
                          ? new Date(account.lastSyncTime)
                          : undefined
                      }
                    />
                  </div>
                  <div className="-ml-3 flex items-center">
                    <SyncNowButton accountId={account.id} />
                  </div>
                </NavLink>
              </Paper>
            );
          })}
        </div>
      </div>
    </div>
  );
}
