import { useParams } from "@remix-run/react";
import { format } from "date-fns";
import { enAU } from "date-fns/locale";
import { SyncStatusIcon } from "~/components/sync/SyncStatusIcon";

export default function SyncHistory() {
  const params = useParams();
  return (
    <div className="flex flex-col gap-4 rounded-md border-2 border-neutral-300 bg-white p-4">
      <div className="flex items-center gap-4 text-xl">
        <SyncStatusIcon status="synced" />
        Sync {params.id}
      </div>
      <pre className="flex gap-1">
        <span className="text-neutral-500">
          {format(new Date(), "P pp", { locale: enAU })}:
        </span>
        Some log entry
      </pre>
      <pre className="flex gap-1">
        <span className="text-neutral-500">
          {format(new Date(), "P pp", { locale: enAU })}:
        </span>
        Here is another thing that happened
      </pre>
      <pre className="flex gap-1">
        <span className="text-neutral-500">
          {format(new Date(), "P pp", { locale: enAU })}:
        </span>
        All done!
      </pre>
    </div>
  );
}
