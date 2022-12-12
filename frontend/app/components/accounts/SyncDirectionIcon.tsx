import { ArrowRightIcon } from "@heroicons/react/24/outline";
import classnames from "classnames";

type SyncDirectionIconProps = {
  className?: string;
};

export function SyncDirectionIcon({ className }: SyncDirectionIconProps) {
  return (
    <ArrowRightIcon
      className={classnames("h-4 w-4 text-gray-500", className)}
    />
  );
}
