import React from "react";

export function ContentHeader({ children }: React.PropsWithChildren) {
  return (
    <div className="sticky flex h-20 items-center border-b-0 border-b-gray-200">
      <div className="container mx-auto">{children}</div>
    </div>
  );
}
