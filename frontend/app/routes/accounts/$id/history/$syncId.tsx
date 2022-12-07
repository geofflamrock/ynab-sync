import { CalendarDaysIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import type { SyncDetailWithLogs, LogLevel } from "api";
import { getSyncDetail } from "api";
import { exhaustiveCheck } from "api/utils/exhaustiveCheck";
import classnames from "classnames";
import { format, parseISO } from "date-fns";
import { enAU } from "date-fns/locale";
import invariant from "tiny-invariant";
import { useRefreshOnInterval } from "~/components/hooks/useRefreshOnInterval";
import { Paper } from "~/components/layout/Paper";
import { DetailSection } from "~/components/primitive/DetailSection";
import { SubHeading } from "~/components/primitive/SubHeading";
import { SyncStatusIcon } from "~/components/sync/SyncStatusIcon";
import { getSyncStatusTitle } from "~/components/sync/SyncStatusTitle";

function getLogLevel(level: string): LogLevel | undefined {
  if (level === "fatal") return "fatal";
  else if (level === "error") return "error";
  else if (level === "warn") return "warn";
  else if (level === "info") return "info";
  else if (level === "debug") return "debug";
  else if (level === "verbose") return "verbose";

  return undefined;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  invariant(params.syncId, "Id must be provided");
  const id = parseInt(params.syncId);
  const url = new URL(request.url);
  const minLogLevelSearchParam = url.searchParams.get("minLogLevel");
  const minLogLevel = getLogLevel(minLogLevelSearchParam ?? "info") ?? "info";
  const levels: Array<LogLevel> = [];

  // This is so bad
  if (minLogLevel === "fatal") levels.push("fatal");
  else if (minLogLevel === "error") levels.push("fatal", "error");
  else if (minLogLevel === "warn") levels.push("fatal", "error", "warn");
  else if (minLogLevel === "info")
    levels.push("fatal", "error", "warn", "info");
  else if (minLogLevel === "debug")
    levels.push("fatal", "error", "warn", "info", "debug");
  else if (minLogLevel === "verbose")
    levels.push("fatal", "error", "warn", "info", "debug", "verbose");

  const syncDetail = await getSyncDetail(id, levels);

  if (!syncDetail) throw new Response("Not Found", { status: 404 });

  return json(syncDetail);
};

type SyncLogMessageProps = {
  timestamp: string;
  level: LogLevel;
  message: string;
};

function getLogLevelDescription(level: LogLevel) {
  switch (level) {
    case "debug":
      return "Debug";
    case "error":
      return "Error";
    case "fatal":
      return "Fatal";
    case "info":
      return "Info";
    case "verbose":
      return "Verbose";
    case "warn":
      return "Warning";

    default:
      exhaustiveCheck(level, "Unknown log level");
  }
}

function SyncLogMessage({ timestamp, level, message }: SyncLogMessageProps) {
  const levelClassName = classnames("whitespace-normal break-all", {
    "text-purple-600": level === "fatal",
    "text-red-600": level === "error",
    "text-orange-600": level === "warn",
    "text-ynab": level === "info",
    "text-gray-700 dark:text-gray-300": level === "debug",
    "text-gray-600 dark:text-gray-400": level === "verbose",
  });

  return (
    <div className="flex gap-4">
      <span className={levelClassName}>{message}</span>
      <span className="ml-auto flex gap-4 text-gray-500">
        <span>{getLogLevelDescription(level)}</span>
        {format(new Date(timestamp), "P pp", { locale: enAU })}
      </span>
    </div>
  );
}

export default function SyncHistoryDetail() {
  const syncDetail = useLoaderData<SyncDetailWithLogs>();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  useRefreshOnInterval({ enabled: true, interval: 5000 });
  const minLogLevel = getLogLevel(searchParams.get("minLogLevel") ?? "info");

  return (
    <div className="flex flex-col gap-4">
      <Paper>
        <div className="flex flex-col gap-4">
          <SubHeading title="Details" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <DetailSection
              icon={
                <SyncStatusIcon
                  status={syncDetail.status}
                  size="large"
                  className="mt-2"
                />
              }
              items={[
                {
                  name: "Status",
                  value: getSyncStatusTitle(syncDetail.status),
                },
              ]}
            />
            <DetailSection
              icon={<CalendarDaysIcon className="mt-2 h-8 w-8" />}
              items={[
                {
                  name: "Min transaction date",
                  value: format(
                    parseISO(syncDetail.options.startDate),
                    "dd/MM/yyyy"
                  ),
                },
              ]}
            />
            {syncDetail.status === "synced" && (
              <DetailSection
                layout="condensed"
                icon={<CreditCardIcon className="mt-2 h-8 w-8" />}
                items={[
                  {
                    name: "New",
                    value:
                      syncDetail.transactionsCreatedCount?.toString() ??
                      "Unknown",
                  },
                  {
                    name: "Updated",
                    value:
                      syncDetail.transactionsUpdatedCount?.toString() ??
                      "Unknown",
                  },
                  {
                    name: "Not changed",
                    value:
                      syncDetail.transactionsUnchangedCount?.toString() ??
                      "Unknown",
                  },
                ]}
              />
            )}
          </div>
        </div>
      </Paper>
      <Paper>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <SubHeading title="Log" />
            <Form
              method="get"
              onChange={(e) => submit(e.currentTarget)}
              className="ml-auto flex items-center gap-2"
            >
              <select
                name="minLogLevel"
                value={minLogLevel ?? "info"}
                className="rounded-lg border-none bg-gray-100 py-2 text-sm text-gray-600 focus:border-none focus:ring-0 dark:bg-gray-700 dark:text-gray-400"
              >
                <option value="info" className="p-4 hover:text-ynab">
                  Info
                </option>
                <option value="debug">Debug</option>
                <option value="verbose">Verbose</option>
              </select>
            </Form>
          </div>

          <pre className="flex flex-col gap-1 text-sm">
            {syncDetail.logs.map((log, index) => (
              <SyncLogMessage
                timestamp={log.timestamp}
                level={log.level}
                message={log.message}
                key={index}
              />
            ))}
          </pre>
        </div>
      </Paper>
    </div>
  );
}
