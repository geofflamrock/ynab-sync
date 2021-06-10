import fs from 'fs';
import ynab, { TransactionDetail } from 'ynab';
import ofx from 'ofx';
import { ITransactionParser } from './ITransactionParser';

export type OfxTransactionParserOptions = {
  importIdPrefix?: string;
  importIdPostfix?: string;
  debug?: boolean;
};

export class OfxTransactionParser implements ITransactionParser {
  private options: OfxTransactionParserOptions;

  constructor(options: OfxTransactionParserOptions) {
    this.options = {
      importIdPrefix: options?.importIdPrefix || '',
      importIdPostfix: options?.importIdPostfix || '',
      debug: options?.debug || false,
    };
  }

  parse(accountId: string, filePath: string): TransactionDetail[] {
    const transactions: TransactionDetail[] = [];

    if (this.options.debug)
      console.log(`Reading transactions from '${filePath}`);

    const ofxRawData = fs.readFileSync(filePath, 'utf8');
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
        id: '',
        import_id: `${this.options.importIdPrefix}-${id}-${this.options.importIdPostfix}`,
        account_id: accountId,
        cleared: ynab.SaveTransaction.ClearedEnum.Cleared,
        approved: false,
        date: dateISO,
        amount: amountMilliunits,
        payee_name: memo,
        deleted: false,
        account_name: '',
        subtransactions: [],
      };

      transactions.push(transaction);
    }

    return transactions;
  }
}
