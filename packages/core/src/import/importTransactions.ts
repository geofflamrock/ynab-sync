import { API, TransactionDetail } from "ynab";
import { minBy } from "lodash";
import { Logger } from "../logging";

export type YnabCredentials = {
  apiKey: string;
};

export type YnabAccount = {
  budgetId: string;
  accountId: string;
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

export type TransactionImportResults = {
  transactionsCreated: TransactionDetail[];
  transactionsUpdated: TransactionDetail[];
  transactionsUnchanged: TransactionDetail[];
};

export async function importTransactions(
  credentials: YnabCredentials,
  account: YnabAccount,
  transactions: TransactionDetail[],
  options: {
    debug?: boolean;
  },
  logger: Logger
): Promise<TransactionImportResults> {
  const ynabAPI = new API(credentials.apiKey);

  const minDate = minBy(transactions, "date");
  const existingTransactions =
    await ynabAPI.transactions.getTransactionsByAccount(
      account.budgetId,
      account.accountId,
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
    if (options.debug)
      logger.debug(
        `Creating ${transactionsToCreate.length} transactions in budget '${account.budgetId}', account '${account.accountId}`,
        transactionsToCreate
      );

    const createResponse = await ynabAPI.transactions.createTransactions(
      account.budgetId,
      { transactions: ensureValidTransactionsForApi(transactionsToCreate) }
    );

    if (options.debug)
      logger.debug("Transaction create response", createResponse);

    results.transactionsCreated = createResponse.data.transactions ?? [];
  } else {
    if (options.debug) logger.debug("No new transactions to create");
  }

  if (transactionsToUpdate && transactionsToUpdate.length) {
    if (options.debug)
      logger.debug(
        `Updating ${transactionsToUpdate.length} transactions in budget '${account.budgetId}', account '${account.accountId}'`,
        transactionsToUpdate
      );

    const updateResponse = await ynabAPI.transactions.updateTransactions(
      account.budgetId,
      { transactions: ensureValidTransactionsForApi(transactionsToUpdate) }
    );

    if (options.debug)
      logger.debug("Transaction update response:", updateResponse);

    results.transactionsUpdated = updateResponse.data.transactions ?? [];
  } else {
    if (options.debug) logger.debug("No existing transactions to update");
  }

  return results;
}
