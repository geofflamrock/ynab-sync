import { NavLink } from "@remix-run/react";
import classnames from "classnames";
import React from "react";
import { YnabIcon } from "../ynab/YnabIcon";

type NavBarItemProps = {
  name?: string;
  icon: React.ReactElement;
  to: string;
  size: "small" | "large";
};

const NavBarItem = ({ name, icon, to, size }: NavBarItemProps) => (
  <NavLink
    to={to}
    className="flex flex-row gap-4 items-center hover:bg-gray-700 px-4 first:-ml-4"
  >
    {icon}
    {name && (
      <span
        className={classnames("text-white", {
          "text-sm": size === "small",
          "text-lg": size === "large",
        })}
      >
        {name}
      </span>
    )}
  </NavLink>
);

export function NavBar() {
  return (
    <div className="w-screen bg-gray-800">
      <div className="container mx-auto h-16 flex flex-row gap-4">
        <NavBarItem to="/" icon={<YnabIcon />} name="YNAB Sync" size="large" />
      </div>
    </div>
  );
}
