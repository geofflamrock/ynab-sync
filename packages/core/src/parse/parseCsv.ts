import fs from "fs";
import { TransactionDetail, SaveTransaction } from "ynab";
import format from "string-template";
import parse from "csv-parse/lib/sync";
import { formatISO } from "date-fns";
import { Logger } from "../logging";

export type CsvTransactionParserOptions = {
  importIdTemplate?: string;
  debug?: boolean;
  getDate: (input: any) => Date;
  getAmount: (input: any) => number;
  getPayee: (input: any) => string;
  getMemo: (input: any) => string | undefined;
};

export function parseCsv(
  accountId: string,
  filePath: string,
  options: CsvTransactionParserOptions,
  logger: Logger
): TransactionDetail[] {
  const defaultImportIdTemplate: string = "{date}-{amount}-{payee}";
  const transactions: TransactionDetail[] = [];

  if (options.debug) logger.debug(`Reading transactions from '${filePath}`);

  const csvRawData = fs.readFileSync(filePath, "utf8");
  const csvParsed = parse(csvRawData, {
    columns: true,
    ignore_last_delimiters: true,
  });

  for (let txn of csvParsed) {
    const dateISO = formatISO(options.getDate(txn), {
      representation: "date",
    });
    const amount = options.getAmount(txn);
    const payee = options.getPayee(txn);
    const memo = options.getMemo(txn);
    const amountMilliunits = Math.round(amount * 1000);

    if (amount === 0) continue;

    const transaction: TransactionDetail = {
      id: "",
      account_id: accountId,
      cleared: SaveTransaction.ClearedEnum.Cleared,
      approved: false,
      date: dateISO,
      amount: amountMilliunits,
      payee_name: payee,
      deleted: false,
      account_name: "",
      memo: memo,
      subtransactions: [],
    };

    const importIdTemplateParameters = {
      date: dateISO,
      amount: amountMilliunits,
      memo: memo,
      payee: payee,
    };

    let importId = format(
      options.importIdTemplate || defaultImportIdTemplate,
      importIdTemplateParameters
    );

    if (importId.length > 36) importId = importId.slice(0, 36);

    if (options.debug) {
      logger.verbose(
        `Created import id '${importId}' from template '${
          options.importIdTemplate || defaultImportIdTemplate
        }' and parameters`,
        importIdTemplateParameters
      );
    }

    transaction.import_id = importId;

    if (options.debug) {
      logger.debug("Parsed transaction", transaction);
    }

    transactions.push(transaction);
  }

  return transactions;
}
