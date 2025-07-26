import { getRequestLocale, getRequestTheme } from '@announcing/components/settings.server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies, request }) => {
  const requestLocale = getRequestLocale(cookies, request);
  const requestTheme = getRequestTheme(cookies);

  return {
    requestLocale,
    requestTheme,
  };
};
