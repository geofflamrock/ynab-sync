import puppeteer, { Page, TimeoutError } from "puppeteer";
import { Logger } from "ynab-sync-core";

async function getLoginError(page: Page): Promise<string | undefined> {
  const alert = await page.$(".alert.alert-error .alert-icon");

  if (alert !== null) {
    const alertMessage: string = (
      await page.evaluate((element) => element.textContent, alert)
    ).trim();
    if (
      alertMessage.startsWith(
        "The details entered don't match those on our system"
      )
    )
      return "The details entered don't match those on our system";
    else {
      return alertMessage;
    }
  }

  return undefined;
}

export type LoginOptions = {
  debug: boolean;
  loginTimeoutInMs: number;
};

export async function createPageAndLogin(
  username: string,
  password: string,
  options: LoginOptions = {
    debug: false,
    loginTimeoutInMs: 2000,
  },
  logger: Logger
): Promise<Page> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await login(page, username, password, options, logger);

  return page;
}

export async function login(
  page: Page,
  username: string,
  password: string,
  options: LoginOptions = {
    debug: false,
    loginTimeoutInMs: 2000,
  },
  logger: Logger
): Promise<void> {
  // Westpac attempts to detect browser compatibility by checking the user agent and redirects to an error page if it's not compatible.
  // When running in headless mode the user agent string contains "HeadlessChrome" which Westpac detects as incompatible,
  // so we'll replace the user agent string with a compatible one.
  await page.setUserAgent(
    (await page.browser().userAgent()).replace("HeadlessChrome", "Chrome")
  );

  await page.goto(
    "https://banking.westpac.com.au/wbc/banking/handler?TAM_OP=login&segment=personal&logout=false"
  );

  await page.type("#fakeusername", username);
  await page.type("#password", password);
  try {
    await Promise.all([
      page.click("#signin"),
      page.waitForNavigation({ timeout: options.loginTimeoutInMs }),
    ]);
  } catch (e) {
    let timeoutError: TimeoutError = e;

    if (!timeoutError) {
      throw e;
    } else {
      if (options.debug)
        logger.debug(`Timeout logging in after ${options.loginTimeoutInMs}ms`);
    }
  }

  const url = page.url();

  if (
    url ===
      "https://banking.westpac.com.au/wbc/banking/handler?TAM_OP=login&segment=personal&logout=false" ||
    url ===
      "https://banking.westpac.com.au/wbc/banking/handler?TAM_OP=auth_failure&logout=false"
  ) {
    const loginError = await getLoginError(page);
    if (loginError) {
      throw new Error(loginError);
    } else {
      throw new Error("An unknown login error has occurred");
    }
  }
}
