import React from "react";

export function Content({ children }: React.PropsWithChildren<any>) {
  return (
    <div className="flex-grow overflow-y-auto bg-neutral-50">
      <div className="">{children}</div>
    </div>
  );
}
