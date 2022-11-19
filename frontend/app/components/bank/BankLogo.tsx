import React from "react";
import type { BankAccountDetail } from "~/api/api";
import type { BankAccountSummary } from "~/api/accountSummary";
import { StGeorgeLogo } from "./StGeorgeLogo";
import { WestpacLogo } from "./WestpacLogo";

type BankLogoProps = {
  bank: BankAccountDetail | BankAccountSummary;
  className?: string;
};

export function BankLogo({ bank, className }: BankLogoProps) {
  switch (bank.type) {
    case "westpac":
      return <WestpacLogo className={className} />;
    case "stgeorge":
      return <StGeorgeLogo className={className} />;
    default:
      return null;
  }
}
