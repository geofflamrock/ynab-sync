import React from "react";

export function Content({ children }: React.PropsWithChildren<any>) {
  return (
    <div className="flex-grow overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="px-16">{children}</div>
    </div>
  );
}
