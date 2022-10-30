import React from "react";
import type { SupportedBanks } from "~/api/api";
import { StGeorgeLogo } from "./StGeorgeLogo";
import { WestpacLogo } from "./WestpacLogo";

type BankLogoProps = {
  bank: SupportedBanks;
};

export function BankLogo({ bank }: BankLogoProps) {
  switch (bank.type) {
    case "westpac":
      return <WestpacLogo />;
    case "stgeorge":
      return <StGeorgeLogo />;
    default:
      return null;
  }
}
