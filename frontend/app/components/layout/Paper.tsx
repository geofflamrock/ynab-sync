import classNames from "classnames";
import React from "react";

type PaperProps = React.PropsWithChildren & {
  className?: string;
};

export function Paper({ children, className }: PaperProps) {
  return (
    <div
      className={classNames(
        "rounded-md bg-white p-4 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        className
      )}
    >
      {children}
    </div>
  );
}
