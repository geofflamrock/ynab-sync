import React from "react";
import { Content } from "./Content";
import { NavBar } from "./NavBar";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: React.PropsWithChildren<any>) {
  return (
    <div className="flex h-screen w-screen flex-row overflow-hidden">
      <Sidebar />
      {/* <NavBar /> */}
      <Content>{children}</Content>
    </div>
  );
}
