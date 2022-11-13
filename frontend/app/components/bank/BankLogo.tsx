import React from "react";
import type { BankDetails } from "~/api/api";
import { StGeorgeLogo } from "./StGeorgeLogo";
import { WestpacLogo } from "./WestpacLogo";

type BankLogoProps = {
  bank: BankDetails;
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
