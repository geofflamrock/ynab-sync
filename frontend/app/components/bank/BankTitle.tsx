import React from "react";
import type { SupportedBanks } from "~/api/api";

type BankTitleProps = {
  bank: SupportedBanks;
};

export function BankTitle({ bank }: BankTitleProps) {
  switch (bank.type) {
    case "westpac":
      return <span>Westpac</span>;

    case "stgeorge":
      return <span>St George</span>;

    default:
      return null;
  }
}
