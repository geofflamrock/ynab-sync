import {
  Bars3Icon,
  Cog6ToothIcon,
  CreditCardIcon,
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
        "group flex flex-col items-center gap-1 py-4 text-neutral-300",
        { active: isActive },
        className
      )
    }
  >
    <div className="rounded-full py-1 px-4 group-hover:bg-neutral-700 group-[.active]:bg-ynab group-[.active]:text-neutral-800">
      {icon}
    </div>
    {name && <span className="text-xs">{name}</span>}
  </NavLink>
);

export function NavigationRail() {
  return (
    <div className="flex h-full w-20 flex-col border-r border-r-neutral-700 bg-neutral-800">
      <SidebarItem to="/" icon={<Bars3Icon className="h-6 w-6" />} />
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
    <div className="flex h-16 w-full items-center justify-around border-t border-t-neutral-700 bg-neutral-800">
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
