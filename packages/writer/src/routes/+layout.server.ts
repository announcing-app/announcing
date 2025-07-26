import { getRequestLocale, getRequestTheme } from '@announcing/components/settings.server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies, request }) => {
  const userID = (await locals.auth())?.user?.id;

  const requestLocale = getRequestLocale(cookies, request);
  const requestTheme = getRequestTheme(cookies);

  return {
    userID,
    requestLocale,
    requestTheme,
  };
};
