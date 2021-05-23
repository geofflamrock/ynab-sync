import puppeteer from 'puppeteer';
import path from "path";
import tmp from "tmp";
import fs from "fs";

export type Credentials = {
  username: string
  password: string
}

export const getWestpacTransactions = async (credentials: Credentials) : Promise<string> => {
  console.trace(`Getting transactions from Westpac`);
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

  console.log(`Setting export parameters`);

  await page.click("#DateRange_StartDate", {clickCount: 3});
  await page.type("#DateRange_StartDate", "01/05/2021")// temp
  await page.type("#Accounts_1", "Transaction");
  await page.click(".autosuggest-suggestions:first-child");
  await page.waitForTimeout(2000);
  await page.click("#File_type_3"); // OFX
  
  const tempDir = tmp.dirSync();
  console.log(`Exporting transaction file to '${tempDir.name}'`);

  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: tempDir.name})
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
  console.trace("Finished getting transactions from Westpac");

  return transactionsFile;
}

const credentials : Credentials = {
  username: process.env.USERNAME || "",
  password: process.env.PASSWORD || ""
}
getWestpacTransactions(credentials);
