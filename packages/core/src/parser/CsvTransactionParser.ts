import fs from "fs";
import { TransactionDetail, SaveTransaction } from "ynab";
import { ITransactionParser } from "./ITransactionParser";
import format from "string-template";
import parse from "csv-parse/lib/sync";

export type CsvTransactionParserOptions = {
  importIdTemplate?: string;
  debug?: boolean;
};

export class CsvTransactionParser implements ITransactionParser {
  private options: CsvTransactionParserOptions;
  private defaultImportIdTemplate: string = "{date}-{memo}-{amount}";

  constructor(options: CsvTransactionParserOptions) {
    this.options = {
      importIdTemplate: options?.importIdTemplate,
      debug: options?.debug || false,
    };
  }

  parse(accountId: string, filePath: string): TransactionDetail[] {
    const transactions: TransactionDetail[] = [];

    if (this.options.debug)
      console.log(`Reading transactions from '${filePath}`);

    const csvRawData = fs.readFileSync(filePath, "utf8");
    const csvParsed = parse(csvRawData, {
      columns: true,
      ignore_last_delimiters: true,
    });

    for (let txn of csvParsed) {
      const dateISO = `${txn.Date.substr(6, 4)}-${txn.Date.substr(
        3,
        2
      )}-${txn.Date.substr(0, 2)}`;
      let amountMilliunits = 0;
      if (txn.Debit) {
        amountMilliunits = Math.round(txn.Debit * 1000);
      } else {
        amountMilliunits = Math.round(txn.Credit * 1000);
      }
      const memo = txn.Description;

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
