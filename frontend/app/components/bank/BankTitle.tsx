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

export function getBankTitle(bank: BankDetails) {
  switch (bank.type) {
    case "westpac":
      return "Westpac";

    case "stgeorge":
      return "St George";

    default:
      throw new Error("Unknown bank type");
  }
}
