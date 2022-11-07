import {
  Bars3Icon,
  Cog6ToothIcon,
  CogIcon,
  CreditCardIcon,
  HomeIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "@remix-run/react";
import classnames from "classnames";
import React from "react";
import { YnabIcon } from "../ynab/YnabIcon";

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
        "group flex flex-col items-center gap-1 py-4 text-white",
        { active: isActive },
        className
      )
    }
  >
    <div className="rounded-full py-1 px-4 group-hover:bg-neutral-700 group-[.active]:bg-ynab">
      {icon}
    </div>
    {name && <span className="text-xs">{name}</span>}
  </NavLink>
);

export function NavigationRail() {
  return (
    <div className="flex h-full w-20 flex-col bg-neutral-800">
      {/* <SidebarItem
        to="/"
        icon={<YnabIcon className="h-6 w-6" />}
        className="mb-auto"
      /> */}
      {/* <SidebarItem to="/" icon={<HomeIcon className="h-6 w-6" />} name="Home" /> */}
      <SidebarItem to="/" icon={<Bars3Icon className="h-6 w-6" />} />
      <SidebarItem
        to="/accounts"
        icon={<CreditCardIcon className="h-6 w-6" />}
        name="Accounts"
      />
      {/* <SidebarItem
        to="/credentials"
        icon={<KeyIcon className="h-6 w-6" />}
        name="Credentials"
      /> */}
      <SidebarItem
        className="mt-auto"
        to="/settings"
        icon={<Cog6ToothIcon className="h-6 w-6" />}
        name="Settings"
      />
    </div>
  );
}

export function NavigationBar() {
  return (
    <div className="flex w-full h-16 items-center justify-around bg-neutral-800">
      {/* <SidebarItem
        to="/"
        icon={<YnabIcon className="h-6 w-6" />}
        className="mb-auto"
      /> */}
      <SidebarItem to="/" icon={<HomeIcon className="h-6 w-6" />} name="Home" />
      <SidebarItem
        to="/accounts"
        icon={<CreditCardIcon className="h-6 w-6" />}
        name="Accounts"
      />
      <SidebarItem
        to="/credentials"
        icon={<KeyIcon className="h-6 w-6" />}
        name="Credentials"
      />
      <SidebarItem
        to="/settings"
        icon={<Cog6ToothIcon className="h-6 w-6" />}
        name="Settings"
      />
    </div>
  );
}
