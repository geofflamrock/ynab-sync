import classNames from "classnames";
import React from "react";

type PaperProps = React.PropsWithChildren & {
  className?: string;
};

export function Paper({ children, className }: PaperProps) {
  return (
    <div
      className={classNames(
        "rounded-lg border-neutral-700 bg-neutral-800 p-4 text-neutral-400",
        className
      )}
    >
      {children}
    </div>
  );
}
