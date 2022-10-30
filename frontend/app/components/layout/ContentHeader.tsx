import React from "react";

export function ContentHeader({ children }: React.PropsWithChildren) {
  return (
    <div className="sticky flex h-16 items-center border-b border-b-neutral-200 bg-white">
      <div className="container mx-auto p-4">{children}</div>
    </div>
  );
}
