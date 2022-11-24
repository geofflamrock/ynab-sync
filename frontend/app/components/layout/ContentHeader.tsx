import React from "react";

export function ContentHeader({ children }: React.PropsWithChildren) {
  return (
    <div className="sticky flex h-20 items-center">
      <div className="container mx-auto">{children}</div>
    </div>
  );
}
