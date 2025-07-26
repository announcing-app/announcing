import { browser } from '$app/environment';
import { setupLocale, type Locales } from '@announcing/i18n';
import jsCookies from 'js-cookie';

export type Themes = 'light' | 'dark';

export const getTheme = (): Themes => {
  if (!browser) {
    return 'light';
  }

  const theme = jsCookies.get('theme');
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }

  const m = window.matchMedia('(prefers-color-scheme: dark)');
  if (m.matches) {
    return 'dark';
  }

  return 'light';
};

export const setTheme = (theme: Themes) => {
  jsCookies.set('theme', theme);
};

export const initTheme = () => {
  setTheme(getTheme());
};

export const setLocale = async (locale: Locales) => {
  jsCookies.set('locale', locale);
  await setupLocale(locale);
};

export const getToolbarSize = () => {
  return localStorage.getItem('toolbarSize') ?? 'normal';
};

export const setToolbarSize = (v: string) => {
  return localStorage.setItem('toolbarSize', v);
};
