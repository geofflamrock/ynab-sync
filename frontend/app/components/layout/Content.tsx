import React from "react";

export function Content({ children }: React.PropsWithChildren<any>) {
  return (
    <div className="flex-grow overflow-y-auto bg-neutral-900">
      <div className="px-4">{children}</div>
    </div>
  );
}
