import { TransactionDetail } from 'ynab';

export interface ITransactionParser {
  parse(accountId: string, filePath: string): TransactionDetail[];
}
