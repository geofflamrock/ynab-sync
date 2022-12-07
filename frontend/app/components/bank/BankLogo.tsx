import React from "react";
import type { BankAccountDetail, BankAccountSummary } from "~/../api";
import { StGeorgeLogo } from "./StGeorgeLogo";
import { WestpacLogo } from "./WestpacLogo";

type BankLogoProps = {
  bank: BankAccountDetail | BankAccountSummary;
  className?: string;
};

export function BankLogo({ bank, className }: BankLogoProps) {
  switch (bank.type) {
    case "westpac-au":
      return <WestpacLogo className={className} />;
    case "st-george-au":
      return <StGeorgeLogo className={className} />;
    default:
      return null;
  }
}
