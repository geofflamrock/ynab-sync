import React from "react";
import type { BankDetails } from "~/api/api";

type BankTitleProps = {
  bank: BankDetails;
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
