import React from "react";
import type { BankAccountDetail } from "~/api";

type BankTitleProps = {
  bank: BankAccountDetail;
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

export function getBankTitle(bank: BankAccountDetail) {
  switch (bank.type) {
    case "westpac":
      return "Westpac";

    case "stgeorge":
      return "St George";

    default:
      throw new Error("Unknown bank type");
  }
}
