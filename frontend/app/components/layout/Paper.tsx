import classNames from "classnames";
import React from "react";

type PaperProps = React.PropsWithChildren & {
  className?: string;
};

export function Paper({ children, className }: PaperProps) {
  return (
    <div
      className={classNames(
        "rounded-lg border-gray-700 bg-gray-800 p-4 text-gray-400",
        className
      )}
    >
      {children}
    </div>
  );
}
