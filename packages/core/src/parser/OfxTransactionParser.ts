import fs from "fs";
import { TransactionDetail, SaveTransaction } from "ynab";
import ofx from "ofx";
import { ITransactionParser } from "./ITransactionParser";
import format from "string-template";

export type OfxTransactionParserOptions = {
  importIdTemplate?: string;
  debug?: boolean;
};

export class OfxTransactionParser implements ITransactionParser {
  private options: OfxTransactionParserOptions;
  private defaultImportIdTemplate: string = "{id}";

  constructor(options: OfxTransactionParserOptions) {
    this.options = {
      importIdTemplate: options?.importIdTemplate,
      debug: options?.debug || false,
    };
  }

  parse(accountId: string, filePath: string): TransactionDetail[] {
    const transactions: TransactionDetail[] = [];

    if (this.options.debug)
      console.log(`Reading transactions from '${filePath}`);

    const ofxRawData = fs.readFileSync(filePath, "utf8");
    const ofxParsed = ofx.parse(ofxRawData);
    const ofxTransactions =
      ofxParsed.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

    for (let txn of ofxTransactions) {
      const id = txn.FITID;
      const dateISO = `${txn.DTPOSTED.substr(0, 4)}-${txn.DTPOSTED.substr(
        4,
        2
      )}-${txn.DTPOSTED.substr(6, 2)}`;
      const amountMilliunits = Math.round(txn.TRNAMT * 1000);
      const memo = txn.MEMO;

      const transaction: TransactionDetail = {
        id: "",
        account_id: accountId,
        cleared: SaveTransaction.ClearedEnum.Cleared,
        approved: false,
        date: dateISO,
        amount: amountMilliunits,
        payee_name: memo,
        deleted: false,
        account_name: "",
        subtransactions: [],
      };

      const importIdTemplateParameters = {
        id: id,
        date: dateISO,
        amount: amountMilliunits,
        memo: memo,
      };

      const importId = format(
        this.options.importIdTemplate || this.defaultImportIdTemplate,
        importIdTemplateParameters
      );

      if (this.options.debug) {
        console.log(
          `Created import id '${importId}' from template '${
            this.options.importIdTemplate || this.defaultImportIdTemplate
          }' and parameters`,
          importIdTemplateParameters
        );
      }

      transaction.import_id = importId;

      if (this.options.debug) {
        console.log("Parsed transaction", transaction);
      }

      transactions.push(transaction);
    }

    return transactions;
  }
}
