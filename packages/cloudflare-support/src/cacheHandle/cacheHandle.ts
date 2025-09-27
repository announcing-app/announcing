import { type Handle } from '@sveltejs/kit';
import type { CacheHandleOptions } from './types';

const checkCacheRoute = (options: CacheHandleOptions, url: URL) => {
  for (const route of options.routes) {
    const result = route.match(url);
    if (result) {
      return result;
    }
  }
  return;
};

export const initCacheHandle = (options: CacheHandleOptions): Handle => {
  const { caches, waitUntil } = options;
  const cache = caches.default;

  return async ({ event, resolve }) => {
    const cacheParams = checkCacheRoute(options, event.url);

    if (!cacheParams) {
      return await resolve(event);
    }

    const cachedResponse = await cache.match(cacheParams.key);
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await resolve(event);
    waitUntil(cache.put(cacheParams.key, response));
    return response;
  };
};
