import { TransactionDetail } from "ynab";

export type TransactionImportResults = {
  transactionsCreated: TransactionDetail[];
  transactionsUpdated: TransactionDetail[];
  transactionsUnchanged: TransactionDetail[];
};

export interface ITransactionImporter {
  import(
    budgetId: string,
    accountId: string,
    transactions: TransactionDetail[]
  ): Promise<TransactionImportResults>;
}
