import React from "react";
import type { BankAccountDetail } from "~/../api";

type BankTitleProps = {
  bank: BankAccountDetail;
};

export function BankTitle({ bank }: BankTitleProps) {
  switch (bank.type) {
    case "westpac-au":
      return <span>Westpac</span>;

    case "st-george-au":
      return <span>St George</span>;

    default:
      return null;
  }
}

export function getBankTitle(bank: BankAccountDetail) {
  switch (bank.type) {
    case "westpac-au":
      return "Westpac";

    case "st-george-au":
      return "St George";

    default:
      throw new Error("Unknown bank type");
  }
}
