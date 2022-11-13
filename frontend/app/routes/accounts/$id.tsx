import { ChevronRightIcon, KeyIcon } from "@heroicons/react/24/outline";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useMatches,
} from "@remix-run/react";
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
import { getBankTitle } from "~/components/bank/BankTitle";
import { YnabIcon } from "~/components/ynab/YnabIcon";
import { SyncNowButton } from "~/components/sync/SyncNowButton";
import { DetailSection } from "../../components/primitive/DetailSection";
import { SyncStatusTitle } from "~/components/sync/SyncStatusTitle";

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

export type DetailItem = {
  name: string;
  value: string;
};

export default function AccountLayout() {
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
          <ChevronRightIcon className="hidden h-4 w-4 text-neutral-500 md:block" />
          <BankAccountSummary account={sync.bank} />
          <SyncDirectionIcon />
          <YnabAccountSummary account={sync.ynab} />
          <div className="ml-auto flex flex-row items-center gap-2">
            <div className="flex items-center gap-1">
              <SyncStatusIcon status={sync.status} />
              <SyncStatusTitle status={sync.status} />
            </div>
            {sync.lastSyncTime && (
              <>
                <div className="hidden h-1 w-1 rounded-full bg-neutral-400 lg:block"></div>
                <div className="hidden text-sm text-neutral-400 lg:block">
                  {formatDistanceToNow(new Date(sync.lastSyncTime), {
                    addSuffix: true,
                  })}
                </div>
              </>
            )}
            <div className="hidden h-1 w-1 rounded-full bg-neutral-400 lg:block"></div>
            <NavLink
              to={`/accounts/${sync.id}/sync-now`}
              className="hidden text-sm text-ynab lg:block"
            >
              Sync now
            </NavLink>
            {/* <SyncNowButton accountId={sync.id} /> */}
          </div>
        </div>
      </ContentHeader>
      <div>
        <Outlet context={sync} />
      </div>
    </div>
  );
}
