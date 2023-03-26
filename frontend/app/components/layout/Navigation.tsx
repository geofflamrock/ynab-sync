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
import type { Environment } from "~/../api";

type NavigationItemProps = {
  name?: string;
  icon: React.ReactElement;
  to: string;
  className?: string;
  orientation?: "vertical" | "horizontal";
};

const NavigationItem = ({
  name,
  icon,
  to,
  className,
  orientation,
}: NavigationItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      classnames(
        "group flex flex-row items-center gap-3 px-4 text-gray-700 dark:text-gray-300",
        {
          "border-l-2 border-l-transparent py-2":
            orientation === undefined || orientation === "vertical",
        },
        {
          "h-full border-b-2 border-b-transparent px-4":
            orientation === "horizontal",
        },
        { "!border-l-ynab !border-b-ynab": isActive },
        className
      )
    }
  >
    <div className="group-hover:text-gray-100">{icon}</div>
    {name && <span className="text-sm group-hover:text-gray-100">{name}</span>}
  </NavLink>
);

type NavigationProps = {
  environment: Environment;
};

export function NavigationRail({ environment }: NavigationProps) {
  return (
    <div className="flex h-full w-64 flex-col gap-2 bg-gray-50 pt-4 pb-2 dark:bg-gray-900">
      {/* <NavigationItem to="/" icon={<Bars3Icon className="h-6 w-6" />} /> */}
      <NavigationItem
        to="/accounts"
        icon={<CreditCardIcon className="h-8 w-8" />}
        name="Accounts"
        orientation="vertical"
      />
      <NavigationItem
        to="/credentials"
        icon={<KeyIcon className="h-8 w-8" />}
        name="Credentials"
        orientation="vertical"
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
          icon={<Cog6ToothIcon className="h-8 w-8" />}
          name="Settings"
          orientation="vertical"
        />
      </div>
    </div>
  );
}

export function NavigationBar({ environment }: NavigationProps) {
  return (
    <div className="flex h-14 w-full items-center justify-around dark:bg-gray-800">
      <NavigationItem
        to="/accounts"
        icon={<CreditCardIcon className="h-7 w-7" />}
        name="Accounts"
        orientation="horizontal"
      />
      <NavigationItem
        to="/credentials"
        icon={<KeyIcon className="h-7 w-7" />}
        name="Credentials"
        orientation="horizontal"
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
        icon={<Cog6ToothIcon className="h-7 w-7" />}
        name="Settings"
        orientation="horizontal"
      />
    </div>
  );
}
