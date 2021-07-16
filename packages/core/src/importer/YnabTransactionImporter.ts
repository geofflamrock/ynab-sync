import { API, TransactionDetail } from "ynab";
import {
  ITransactionImporter,
  TransactionImportResults,
} from "./ITransactionImporter";
import { minBy } from "lodash";

export type YnabCredentials = {
  apiKey: string;
};

export type YnabTransactionImporterOptions = {
  credentials: YnabCredentials;
  debug?: boolean;
};

function ensureValidTransactionsForApi(transactions: TransactionDetail[]) {
  return transactions.map((t) => {
    fixTransactionDetailForApi(t);
    return t;
  });
}

function fixTransactionDetailForApi(transaction: TransactionDetail) {
  if (transaction.payee_name && transaction.payee_name.length > 100) {
    transaction.payee_name = transaction.payee_name.substring(0, 100);
  }
}

export class YnabTransactionImporter implements ITransactionImporter {
  private options: YnabTransactionImporterOptions;

  constructor(options: YnabTransactionImporterOptions) {
    this.options = options;
  }

  async import(
    budgetId: string,
    accountId: string,
    transactions: TransactionDetail[]
  ): Promise<TransactionImportResults> {
    const ynabAPI = new API(this.options.credentials.apiKey);

    const minDate = minBy(transactions, "date");
    const existingTransactions =
      await ynabAPI.transactions.getTransactionsByAccount(
        budgetId,
        accountId,
        minDate?.date
      );

    const transactionsToCreate: TransactionDetail[] = [];
    const transactionsToUpdate: TransactionDetail[] = [];
    const transactionsUnchanged: TransactionDetail[] = [];

    transactions.forEach((transaction) => {
      const existingTransaction: TransactionDetail | undefined =
        existingTransactions.data.transactions.find(
          (t) => t.import_id === transaction.import_id
        );
      if (existingTransaction) {
        if (
          existingTransaction.amount !== transaction.amount ||
          existingTransaction.date !== transaction.date
        ) {
          transactionsToUpdate.push(transaction);
        } else {
          transactionsUnchanged.push(transaction);
        }
      } else {
        transactionsToCreate.push(transaction);
      }
    });

    let results: TransactionImportResults = {
      transactionsCreated: [],
      transactionsUpdated: [],
      transactionsUnchanged: transactionsUnchanged,
    };

    if (transactionsToCreate && transactionsToCreate.length) {
      if (this.options.debug)
        console.log(
          `Creating ${transactionsToCreate.length} transactions in budget '${budgetId}'`,
          transactionsToCreate
        );

      const createResponse = await ynabAPI.transactions.createTransactions(
        budgetId,
        { transactions: ensureValidTransactionsForApi(transactionsToCreate) }
      );

      if (this.options.debug)
        console.log("Transaction create response", createResponse);

      results.transactionsCreated = createResponse.data.transactions ?? [];
    } else {
      if (this.options.debug) console.log("No new transactions to create");
    }

    if (transactionsToUpdate && transactionsToUpdate.length) {
      if (this.options.debug)
        console.log(
          `Updating ${transactionsToUpdate.length} transactions in budget '${budgetId}'`,
          transactionsToUpdate
        );

      const updateResponse = await ynabAPI.transactions.updateTransactions(
        budgetId,
        { transactions: ensureValidTransactionsForApi(transactionsToUpdate) }
      );

      if (this.options.debug)
        console.log("Transaction update response:", updateResponse);

      results.transactionsUpdated = updateResponse.data.transactions ?? [];
    } else {
      if (this.options.debug) console.log("No existing transactions to update");
    }

    return results;
  }
}
