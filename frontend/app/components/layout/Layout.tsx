import React from "react";
import { Content } from "./Content";
import { NavigationBar, NavigationRail } from "./NavigationRail";

export function Layout({ children }: React.PropsWithChildren<any>) {
  return (
    <>
      <div className="h-screen w-screen flex-row overflow-hidden hidden md:flex">
        <NavigationRail />
        <Content>{children}</Content>
      </div>
      <div className="flex h-screen w-screen flex-col overflow-hidden md:hidden">
        <Content>{children}</Content>
        <NavigationBar />
      </div>
    </>
  );
}
