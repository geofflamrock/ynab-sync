import puppeteer, { Page, TimeoutError } from "puppeteer";

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
  }
): Promise<Page> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await login(page, username, password, options);

  return page;
}

export async function login(
  page: Page,
  username: string,
  password: string,
  options: LoginOptions = {
    debug: false,
    loginTimeoutInMs: 2000,
  }
): Promise<void> {
  await page.goto(
    "https://banking.westpac.com.au/wbc/banking/handler?TAM_OP=login&segment=personal&logout=false"
  );

  console.log(await page.browser().version());
  console.log(page.url());
  await page.screenshot({ path: "login.png" });

  await page.waitForSelector("#fakeusername");

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
        console.log(`Timeout logging in after ${options.loginTimeoutInMs}ms`);
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
