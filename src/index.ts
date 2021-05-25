import puppeteer from "puppeteer";
import path from "path";
import tmp from "tmp";
import fs from "fs";
import { format } from "date-fns";
import ynab, { TransactionDetail } from "ynab";
import ofx from "ofx";

export type Credentials = {
  username: string
  password: string
}

export type YnabCredentials = {
  apiKey: string
}

export const getWestpacTransactions = async (credentials: Credentials, accountName: string) : Promise<string> => {
  console.log(`Getting transactions from Westpac`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  await page.goto('https://banking.westpac.com.au/wbc/banking/handler?TAM_OP=login&segment=personal&logout=false');

  console.log(`Authenticating using username '${credentials.username}'`);

  await page.type("#username", credentials.username);
  await page.type("#password", credentials.password);
  await page.click("#signin");

  await page.waitForNavigation();

  console.log(`Authenticated successfully using username '${credentials.username}'`);

  await page.goto('https://banking.westpac.com.au/secure/banking/reportsandexports/exportparameters/2/');  

  // Select all of the start date field and replace with first of the month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startDate = format(firstDayOfMonth, "dd/MM/yyyy");
  
  console.log(`Setting export parameter start date '${startDate}'`);
  await page.click("#DateRange_StartDate", {clickCount: 3});
  await page.type("#DateRange_StartDate", startDate);  

  console.log(`Setting export parameter account '${accountName}'`);
  await page.type("#Accounts_1", accountName);
  await page.waitForTimeout(2000);
  await page.waitForSelector(".autosuggest-suggestions:first-child");
  await page.click(".autosuggest-suggestions:first-child");

  console.log(`Setting export parameter file format 'ofx'`);  
  await page.waitForTimeout(2000);
  await page.waitForSelector("#File_type_3");
  await page.click("#File_type_3"); // OFX
  
  const tempDir = tmp.dirSync();
  console.log(`Exporting transaction file to '${tempDir.name}'`);

  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: tempDir.name});
  await page.click('.btn-actions > .btn.export-link');

  let transactionsFile = "";

  while (true) {
    const downloadDirFiles = fs.readdirSync(tempDir.name);

    if (downloadDirFiles.length > 0) {      
      transactionsFile = path.join(tempDir.name, downloadDirFiles[0]);
      console.log(`Transactions exported to '${transactionsFile}'`);
      break;
    }
    await page.waitForTimeout(1000);
  }  

  await browser.close();
  console.log("Finished getting transactions from Westpac");

  return transactionsFile;
}

const parseTransactions = (filePath: string, accountId: string, accountName: string) : TransactionDetail[] => {
  const transactions: TransactionDetail[] = [];

  console.log(`Reading transactions from '${filePath}`);

  const ofxRawData = fs.readFileSync(filePath, "utf8");
  const ofxParsed = ofx.parse(ofxRawData);
  const ofxTransactions = ofxParsed.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

  for (let txn of ofxTransactions) {
    const id = txn.FITID;
    // console.log(txn.DTPOSTED);
    const dateISO = `${txn.DTPOSTED.substr(0, 4)}-${txn.DTPOSTED.substr(4, 2)}-${txn.DTPOSTED.substr(6, 2)}`;
    const amountMilliunits = txn.TRNAMT * 1000;
    const memo = txn.MEMO;

    const transaction : TransactionDetail = {
      id: "", // need to provide a value for typescript validation
      import_id: `${id}-test2`,
      account_id: accountId,
      cleared: ynab.SaveTransaction.ClearedEnum.Cleared,
      approved: false,
      date: dateISO,
      amount: amountMilliunits,
      payee_name: memo,
      deleted: false,
      account_name: accountName,
      subtransactions: []
    };

    // console.log(transaction);

    transactions.push(transaction);
  }

  return transactions;
}

const importTransactions = async(ynabCredentials: YnabCredentials, budgetId: string, transactions: TransactionDetail[]) => {  
  const ynabAPI = new ynab.API(ynabCredentials.apiKey);
  console.log(`Importing transactions into budget '${budgetId}'`);
  const response = await ynabAPI.transactions.createTransactions(budgetId, { transactions });
  console.log(response);
}

const credentials : Credentials = {
  username: process.env.USERNAME || "",
  password: process.env.PASSWORD || ""
}

const ynabCredentials : YnabCredentials = {
  apiKey: process.env.YNAB_API_KEY || "",
};

(async () => {
  try {
    const accountName = "Transaction";
    const transactionsFilePath = await getWestpacTransactions(credentials, accountName);
    const transactions = parseTransactions(transactionsFilePath, "9e528ea0-b21d-447b-ae2e-e256cceb4bbf", accountName);
    console.log(`Parsed ${transactions.length} transactions`);
    await importTransactions(ynabCredentials, "3f967bf6-9cad-473f-a72f-bcb27e42850a", transactions);
  }
  catch (error) {
    console.error(error);
  }
})();

// budget: "3f967bf6-9cad-473f-a72f-bcb27e42850a"
// account: "9e528ea0-b21d-447b-ae2e-e256cceb4bbf"
