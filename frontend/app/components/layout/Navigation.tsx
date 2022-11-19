import {
  Bars3Icon,
  Cog6ToothIcon,
  CreditCardIcon,
  KeyIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "@remix-run/react";
import classnames from "classnames";
import React from "react";
import type { Environment } from "~/api/environment";

type NavigationItemProps = {
  name?: string;
  icon: React.ReactElement;
  to: string;
  className?: string;
};

const NavigationItem = ({ name, icon, to, className }: NavigationItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      classnames(
        "group flex flex-col items-center gap-1 py-4 text-gray-700 dark:text-gray-300",
        { active: isActive },
        className
      )
    }
  >
    <div className="rounded-full py-1 px-4 group-hover:bg-gray-100 group-[.active]:bg-ynab group-[.active]:text-gray-800 dark:group-hover:bg-gray-700 dark:group-[.active]:bg-ynab">
      {icon}
    </div>
    {name && <span className="text-xs">{name}</span>}
  </NavLink>
);

type NavigationProps = {
  environment: Environment;
};

export function NavigationRail({ environment }: NavigationProps) {
  return (
    <div className="flex h-full w-20 flex-col dark:border-r-0 dark:border-r-gray-700 dark:bg-gray-800">
      <NavigationItem to="/" icon={<Bars3Icon className="h-6 w-6" />} />
      <NavigationItem
        to="/accounts"
        icon={<CreditCardIcon className="h-6 w-6" />}
        name="Accounts"
      />
      <NavigationItem
        to="/credentials"
        icon={<KeyIcon className="h-6 w-6" />}
        name="Credentials"
      />
      <div className="mt-auto">
        {/* {environment === "development" && (
          <NavigationItem
            to="/theme"
            icon={<PaintBrushIcon className="h-6 w-6" />}
            name="Theme"
          />
        )} */}
        <NavigationItem
          to="/settings"
          icon={<Cog6ToothIcon className="h-6 w-6" />}
          name="Settings"
        />
      </div>
    </div>
  );
}

export function NavigationBar({ environment }: NavigationProps) {
  return (
    <div className="flex h-16 w-full items-center justify-around dark:border-t-0 dark:border-t-gray-700 dark:bg-gray-800">
      <NavigationItem
        to="/accounts"
        icon={<CreditCardIcon className="h-6 w-6" />}
        name="Accounts"
      />
      <NavigationItem
        to="/credentials"
        icon={<KeyIcon className="h-6 w-6" />}
        name="Credentials"
      />
      {/* {environment === "development" && (
        <NavigationItem
          to="/theme"
          icon={<PaintBrushIcon className="h-6 w-6" />}
          name="Theme"
        />
      )} */}
      <NavigationItem
        to="/settings"
        icon={<Cog6ToothIcon className="h-6 w-6" />}
        name="Settings"
      />
    </div>
  );
}
