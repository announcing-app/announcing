import { LL, locale, setLocale } from './i18n/i18n-svelte';
import type { Locales } from './i18n/i18n-types';
import { loadLocaleAsync } from './i18n/i18n-util.async';

const validLocales = new Set(['en', 'ja']);

const checkLocale = (locale: string | undefined): Locales | undefined => {
  if (locale && validLocales.has(locale)) {
    return locale as Locales;
  }
  return;
};

export const detectLocale = ({
  cookie,
  acceptLanguage,
}: {
  cookie: string | undefined;
  acceptLanguage: string | undefined;
}): Locales => {
  {
    const locale = checkLocale(cookie);
    if (locale) {
      return locale;
    }
  }
  if (acceptLanguage) {
    const s = acceptLanguage.split(/[,;-]/)[0];
    const locale = checkLocale(s);
    if (locale) {
      return locale;
    }
  }

  return 'en';
};

export const setupLocale = async (locale: Locales) => {
  await loadLocaleAsync(locale);
  setLocale(locale);
};

export { LL, locale };
export type { Locales };
