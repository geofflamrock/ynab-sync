import * as locales from "date-fns/locale";
import osLocale from "os-locale";

export async function getUserLocale(): Promise<Locale | undefined> {
  const userLocale = await osLocale();
  let locale: Locale | undefined = undefined;

  for (const localeEntry of Object.entries(locales)) {
    if (localeEntry[1].code === userLocale) {
      locale = localeEntry[1];
      break;
    }
  }

  return locale;
}
