import puppeteer, { Page } from 'puppeteer';
import path from 'path';
import tmp from 'tmp';
import fs from 'fs';
import { format } from 'date-fns';
import ynab, { TransactionDetail } from 'ynab';
import ofx from 'ofx';
import {
  login,
  exportTransactions,
  ExportFormat,
} from '@geofflamrock/westpac-au-scraper';

export type Credentials = {
  username: string;
  password: string;
};

export type YnabCredentials = {
  apiKey: string;
};

const getFirstDayOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const getYesterday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
};

const parseTransactions = (
  filePath: string,
  accountId: string,
  accountName: string,
  importIdPrefix: string = '',
  importIdPostfix: string = ''
): TransactionDetail[] => {
  const transactions: TransactionDetail[] = [];

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
      id: '', // need to provide a value for typescript validation
      import_id: `${importIdPrefix}-${id}-${importIdPostfix}`,
      account_id: accountId,
      cleared: ynab.SaveTransaction.ClearedEnum.Cleared,
      approved: false,
      date: dateISO,
      amount: amountMilliunits,
      payee_name: memo,
      deleted: false,
      account_name: accountName,
      subtransactions: [],
    };

    transactions.push(transaction);
  }

  return transactions;
};

const importTransactions = async (
  ynabCredentials: YnabCredentials,
  budgetId: string,
  transactions: TransactionDetail[]
) => {
  const ynabAPI = new ynab.API(ynabCredentials.apiKey);

  const firstDayOfMonth = getFirstDayOfMonth();
  const existingTransactions = await ynabAPI.transactions.getTransactions(
    budgetId,
    firstDayOfMonth
  );

  const transactionsToCreate: TransactionDetail[] = [];
  const transactionsToUpdate: TransactionDetail[] = [];

  transactions.forEach(transaction => {
    const existingTransaction:
      | TransactionDetail
      | undefined = existingTransactions.data.transactions.find(
      t => t.import_id === transaction.import_id
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
    console.log(`Creating transactions in budget '${budgetId}'`);
    const createResponse = await ynabAPI.transactions.createTransactions(
      budgetId,
      { transactions: transactionsToCreate }
    );
    console.log(
      `Transaction create response: ${JSON.stringify(createResponse)}`
    );
  } else {
    console.log('No new transactions to create');
  }

  if (transactionsToUpdate && transactionsToUpdate.length) {
    console.log(`Updating transactions in budget '${budgetId}'`);
    const updateResponse = await ynabAPI.transactions.updateTransactions(
      budgetId,
      { transactions: transactionsToUpdate }
    );
    console.log(
      `Transaction update response: ${JSON.stringify(updateResponse)}`
    );
  } else {
    console.log('No existing transactions to update');
  }
};

const credentials: Credentials = {
  username: process.env.WESTPAC_USERNAME || '',
  password: process.env.WESTPAC_PASSWORD || '',
};

const ynabCredentials: YnabCredentials = {
  apiKey: process.env.YNAB_API_KEY || '',
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    console.log(`Logging in with username '${credentials.username}'`);
    await login(page, credentials.username, credentials.password);
    console.log(
      `Successfully logged in with username '${credentials.username}'`
    );
    const accountName = 'Transaction';

    const startDate = getFirstDayOfMonth();
    const endDate = getYesterday();

    console.log(
      `Exporting transactions from westpac for account '${accountName}' for dates '${format(
        startDate,
        'dd/MM/yyyy'
      )}' to '${format(endDate, 'dd/MM/yyyy')}'`
    );
    const transactionsFilePath = await exportTransactions(
      page,
      accountName,
      startDate
    );

    console.log(`Exported transactions to '${transactionsFilePath}'`);

    const transactions = parseTransactions(
      transactionsFilePath,
      'ec2da106-1d26-4831-bdfa-28277212c98a',
      accountName
    );

    console.log(`Parsed ${transactions.length} transactions`);

    await importTransactions(
      ynabCredentials,
      '3f967bf6-9cad-473f-a72f-bcb27e42850a',
      transactions
    );
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();

// budget: "3f967bf6-9cad-473f-a72f-bcb27e42850a"
// account: "ec2da106-1d26-4831-bdfa-28277212c98a"
