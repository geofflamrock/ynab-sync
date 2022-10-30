import {
  Cog6ToothIcon,
  CogIcon,
  CreditCardIcon,
  HomeIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "@remix-run/react";
import classnames from "classnames";
import React from "react";

type SidearItemProps = {
  name?: string;
  icon: React.ReactElement;
  to: string;
  className?: string;
};

const SidebarItem = ({ name, icon, to, className }: SidearItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      classnames(
        "flex flex-col items-center gap-2 py-4 text-white hover:bg-gray-700",
        { "text-ynab": isActive },
        className
      )
    }
  >
    {icon}
    {/* {name && <span className="text-xs">{name}</span>} */}
  </NavLink>
);

export function Sidebar() {
  return (
    <div className="flex h-full w-20 flex-col bg-gray-800">
      <SidebarItem to="/" icon={<HomeIcon className="h-8 w-8" />} name="Home" />
      <SidebarItem
        to="/accounts"
        icon={<CreditCardIcon className="h-8 w-8" />}
        name="Accounts"
      />
      <SidebarItem
        to="/credentials"
        icon={<KeyIcon className="h-8 w-8" />}
        name="Credentials"
      />
      <SidebarItem
        to="/settings"
        icon={<Cog6ToothIcon className="h-8 w-8" />}
        name="Settings"
        className="mt-auto"
      />
    </div>
  );
}
