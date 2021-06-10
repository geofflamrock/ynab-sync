import puppeteer from 'puppeteer';
import { format, startOfMonth, startOfYesterday } from 'date-fns';
import { login, exportTransactions } from '@geofflamrock/westpac-au-scraper';
import { ITransactionParser } from './parser/ITransactionParser';
import { OfxTransactionParser } from './parser/OfxTransactionParser';
import {
  ITransactionImporter,
  YnabCredentials,
  YnabTransactionImporter,
} from './importer';

type Credentials = {
  username: string;
  password: string;
};

const credentials: Credentials = {
  username: process.env.WESTPAC_USERNAME || '',
  password: process.env.WESTPAC_PASSWORD || '',
};

const ynabCredentials: YnabCredentials = {
  apiKey: process.env.YNAB_API_KEY || '',
};

const debug: boolean = !!process.env.YNAB_SYNC_DEBUG || false;

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

    const startDate = startOfMonth(new Date());
    const endDate = startOfYesterday();

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

    let parser: ITransactionParser = new OfxTransactionParser({ debug: debug });

    const transactions = parser.parse(
      'ec2da106-1d26-4831-bdfa-28277212c98a',
      transactionsFilePath
    );

    console.log(`Parsed ${transactions.length} transactions`);

    let importer: ITransactionImporter = new YnabTransactionImporter({
      credentials: ynabCredentials,
      debug: debug,
    });

    console.log(`Importing ${transactions.length} transactions`);
    await importer.import('3f967bf6-9cad-473f-a72f-bcb27e42850a', transactions);
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();

// budget: "3f967bf6-9cad-473f-a72f-bcb27e42850a"
// account: "ec2da106-1d26-4831-bdfa-28277212c98a"
