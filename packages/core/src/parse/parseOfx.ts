import fs from "fs";
import { TransactionDetail, SaveTransaction } from "ynab";
import ofx from "ofx";
import format from "string-template";
import { Logger } from "../logging";

export type OfxTransactionParserOptions = {
  importIdTemplate?: string;
  debug?: boolean;
};

export function parseOfx(
  accountId: string,
  filePath: string,
  options: OfxTransactionParserOptions,
  logger: Logger
): TransactionDetail[] {
  const transactions: TransactionDetail[] = [];
  const defaultImportIdTemplate: string = "{id}";

  if (options.debug) logger.info(`Reading transactions from '${filePath}`);

  const ofxRawData = fs.readFileSync(filePath, "utf8");
  const ofxParsed = ofx.parse(ofxRawData);
  let ofxTransactions =
    ofxParsed.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

  if (!Array.isArray(ofxTransactions)) {
    ofxTransactions = [ofxTransactions];
  }

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
      options.importIdTemplate || defaultImportIdTemplate,
      importIdTemplateParameters
    );

    if (options.debug) {
      logger.info(
        `Created import id '${importId}' from template '${
          options.importIdTemplate || defaultImportIdTemplate
        }' and parameters`,
        importIdTemplateParameters
      );
    }

    transaction.import_id = importId;

    if (options.debug) {
      logger.info("Parsed transaction", transaction);
    }

    transactions.push(transaction);
  }

  return transactions;
}
