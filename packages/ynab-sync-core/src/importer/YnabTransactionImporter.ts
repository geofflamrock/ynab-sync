import { API, TransactionDetail } from "ynab";
import { ITransactionImporter } from "./ITransactionImporter";
import { minBy } from "lodash";

export type YnabCredentials = {
  apiKey: string;
};

export type YnabTransactionImporterOptions = {
  credentials: YnabCredentials;
  debug?: boolean;
};

export class YnabTransactionImporter implements ITransactionImporter {
  private options: YnabTransactionImporterOptions;

  constructor(options: YnabTransactionImporterOptions) {
    this.options = options;
  }

  async import(
    budgetId: string,
    transactions: TransactionDetail[]
  ): Promise<void> {
    const ynabAPI = new API(this.options.credentials.apiKey);

    const minDate = minBy(transactions, "date");
    const existingTransactions = await ynabAPI.transactions.getTransactions(
      budgetId,
      minDate?.date
    );

    const transactionsToCreate: TransactionDetail[] = [];
    const transactionsToUpdate: TransactionDetail[] = [];

    transactions.forEach((transaction) => {
      const existingTransaction: TransactionDetail | undefined =
        existingTransactions.data.transactions.find(
          (t) => t.import_id === transaction.import_id
        );
      if (existingTransaction) {
        if (
          existingTransaction.amount !== transaction.amount ||
          existingTransaction.date !== transaction.date
        )
          transactionsToUpdate.push(transaction);
      } else {
        transactionsToCreate.push(transaction);
      }
    });

    if (transactionsToCreate && transactionsToCreate.length) {
      if (this.options.debug)
        console.log(
          `Creating ${transactionsToCreate.length} transactions in budget '${budgetId}'`
        );

      const createResponse = await ynabAPI.transactions.createTransactions(
        budgetId,
        { transactions: transactionsToCreate }
      );

      if (this.options.debug)
        console.log(
          `Transaction create response: ${JSON.stringify(createResponse)}`
        );
    } else {
      if (this.options.debug) console.log("No new transactions to create");
    }

    if (transactionsToUpdate && transactionsToUpdate.length) {
      if (this.options.debug)
        console.log(
          `Updating ${transactionsToUpdate.length} transactions in budget '${budgetId}'`
        );

      const updateResponse = await ynabAPI.transactions.updateTransactions(
        budgetId,
        { transactions: transactionsToUpdate }
      );

      if (this.options.debug)
        console.log(
          `Transaction update response: ${JSON.stringify(updateResponse)}`
        );
    } else {
      if (this.options.debug) console.log("No existing transactions to update");
    }
  }
}
