import {
  CalendarDaysIcon,
  CheckIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import type { SyncDetailWithLogs, SyncLogLevel } from "api";
import { getSyncDetail } from "api";
import classnames from "classnames";
import { format, parseISO } from "date-fns";
import { enAU } from "date-fns/locale";
import { useRef } from "react";
import invariant from "tiny-invariant";
import { useRefreshOnInterval } from "~/components/hooks/useRefreshOnInterval";
import { Paper } from "~/components/layout/Paper";
import { DetailSection } from "~/components/primitive/DetailSection";
import { SubHeading } from "~/components/primitive/SubHeading";
import { SyncStatusIcon } from "~/components/sync/SyncStatusIcon";
import { getSyncStatusTitle } from "~/components/sync/SyncStatusTitle";

function getLogLevel(level: string): SyncLogLevel {
  if (level === "fatal") return "fatal";
  else if (level === "error") return "error";
  else if (level === "warn") return "warn";
  else if (level === "info") return "info";
  else if (level === "debug") return "debug";
  else if (level === "verbose") return "verbose";

  throw new Error(`Unknown log level '${level}'`);
}

export const loader: LoaderFunction = async ({ params, request }) => {
  invariant(params.syncId, "Id must be provided");
  const id = parseInt(params.syncId);
  const url = new URL(request.url);
  const logLevelSearchParams = url.searchParams.getAll("level");
  const logLevels = logLevelSearchParams.map((l) => getLogLevel(l));

  if (logLevels.length === 0) {
    logLevels.push("fatal", "error", "warn", "info");
  }

  const syncDetail = await getSyncDetail(id, logLevels);

  if (!syncDetail) throw new Response("Not Found", { status: 404 });

  return json(syncDetail);
};

type SyncLogMessageProps = {
  timestamp: string;
  level: SyncLogLevel;
  message: string;
};

function SyncLogMessage({ timestamp, level, message }: SyncLogMessageProps) {
  const levelClassName = classnames("whitespace-normal", {
    "text-purple-600": level === "fatal",
    "text-red-600": level === "error",
    "text-orange-600": level === "warn",
    "text-ynab": level === "info",
    "text-gray-700 dark:text-gray-300": level === "debug",
    "text-gray-600 dark:text-gray-400": level === "verbose",
  });

  return (
    <div className="grid grid-cols-12 gap-4">
      <span className={classnames(levelClassName)}>{level}</span>
      <span className={classnames(levelClassName, "col-span-9")}>
        {message}
      </span>
      <span className="col-span-2 ml-auto text-gray-500">
        {format(new Date(timestamp), "P pp", { locale: enAU })}
      </span>
    </div>
  );
}

type FilterChipProps = {
  name: string;
  value: string;
  title: string;
  selected: boolean;
};

function FilterChip({ name, value, title, selected }: FilterChipProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className={classnames(
        "flex cursor-pointer select-none items-center gap-1 rounded-lg border py-1 pr-4 text-sm text-gray-300",
        {
          "border-gray-700 bg-gray-700 pl-2": selected,
          "border-gray-400 bg-transparent pl-4": !selected,
        }
      )}
      onClick={() => {
        inputRef.current?.click();
      }}
    >
      {selected && <CheckIcon className="h-4 w-4" />}
      <input
        type="checkbox"
        defaultChecked={selected}
        name={name}
        value={value}
        ref={inputRef}
        className="hidden"
      />
      {title}
    </div>
  );
}

export default function SyncHistoryDetail() {
  const syncDetail = useLoaderData<SyncDetailWithLogs>();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  useRefreshOnInterval({ enabled: true, interval: 5000 });
  const logLevels = searchParams.getAll("level");

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
                    name: "Created",
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
              <FilterChip
                name="level"
                value="error"
                title="Error"
                selected={logLevels.length === 0 || logLevels.includes("error")}
              />
              <FilterChip
                name="level"
                value="warn"
                title="Warning"
                selected={logLevels.length === 0 || logLevels.includes("warn")}
              />
              <FilterChip
                name="level"
                value="info"
                title="Info"
                selected={logLevels.length === 0 || logLevels.includes("info")}
              />
              <FilterChip
                name="level"
                value="debug"
                title="Debug"
                selected={logLevels.includes("debug")}
              />
              <FilterChip
                name="level"
                value="verbose"
                title="Verbose"
                selected={logLevels.includes("verbose")}
              />
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