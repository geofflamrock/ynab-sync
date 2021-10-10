import { Page, TimeoutError } from "puppeteer";
import { Logger } from "ynab-sync-core";

export type LoginOptions = {
  loginTimeoutInMs: number;
};

export async function login(
  page: Page,
  accessNumber: string,
  password: string,
  securityNumber: number,
  logger: Logger,
  options: LoginOptions = {
    loginTimeoutInMs: 5000,
  }
): Promise<void> {
  await page.goto("https://ibanking.stgeorge.com.au/ibank/loginPage.action");

  await page.type("#access-number", accessNumber);
  await page.type("#securityNumber", securityNumber.toString());
  await page.type("#internet-password", password);
  try {
    await Promise.all([
      page.click("#logonButton"),
      page.waitForNavigation({ timeout: options.loginTimeoutInMs }),
    ]);
  } catch (e) {
    let timeoutError: TimeoutError = e;

    if (!timeoutError) {
      throw e;
    } else {
      console.log("A timeout error has occurred attempting to login");
    }
  }

  const url = page.url();

  if (
    url !== "https://ibanking.stgeorge.com.au/ibank/viewAccountPortfolio.html"
  ) {
    throw new Error("An unknown login error has occurred"); // temp
  }
}
