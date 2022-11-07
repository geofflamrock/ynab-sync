import React from "react";

export function Paper({ children }: React.PropsWithChildren) {
  return (
    <div className="rounded-lg p-4 bg-neutral-800 text-neutral-400">
      {children}
    </div>
  );
}
