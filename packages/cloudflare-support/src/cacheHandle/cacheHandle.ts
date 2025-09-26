import { type Handle } from '@sveltejs/kit';
import type { CacheHandleOptions } from './types';

export const initCacheHandle = (options: CacheHandleOptions): Handle => {
  return async ({ event, resolve }) => {
    const response = await resolve(event);
    return response;
  };
};
