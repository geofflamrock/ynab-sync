import React from "react";

export function ContentHeader({ children }: React.PropsWithChildren) {
  return (
    <div className="sticky flex h-16 items-center border-b-0 border-b-neutral-200 bg-neutral-900">
      <div className="container mx-auto">{children}</div>
    </div>
  );
}
