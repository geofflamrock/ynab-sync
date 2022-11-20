import React from "react";
import type { Environment } from "~/../api";
import { Content } from "./Content";
import { NavigationBar, NavigationRail } from "./Navigation";

type LayoutProps = React.PropsWithChildren<any> & {
  environment: Environment;
};

export function Layout({ environment, children }: LayoutProps) {
  return (
    <>
      <div className="hidden h-screen w-screen flex-row overflow-hidden md:flex">
        <NavigationRail environment={environment} />
        <Content>{children}</Content>
      </div>
      <div className="flex h-screen w-screen flex-col overflow-hidden md:hidden">
        <Content>{children}</Content>
        <NavigationBar environment={environment} />
      </div>
    </>
  );
}
