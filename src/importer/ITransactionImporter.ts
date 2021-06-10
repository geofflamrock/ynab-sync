import { TransactionDetail } from 'ynab';

export interface ITransactionImporter {
  import(budgetId: string, transactions: TransactionDetail[]): Promise<void>;
}
