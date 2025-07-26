import { detectLocale, type Locales } from '@announcing/i18n';
import { type Cookies } from '@sveltejs/kit';
import type { Themes } from './settings';

export const getRequestTheme = (cookies: Cookies): Themes | undefined => {
  const theme = cookies.get('theme');
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }
  return;
};

export const getRequestLocale = (cookies: Cookies, request: Request): Locales => {
  return detectLocale({
    cookie: cookies.get('locale'),
    acceptLanguage: request.headers.get('accept-language') ?? undefined,
  });
};
