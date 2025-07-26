const open = async (caches: CacheStorage) => {
  return await caches.open('app-caches');
};

export const APP_CACHES_PREFIX = '/_caches/';

export const putBlob = async (caches: CacheStorage, id: string, blob: Blob) => {
  const url = `${APP_CACHES_PREFIX}${id}`;
  const cache = await open(caches);
  await cache.put(url, new Response(blob));

  return url;
};

const getBlob = async (caches: CacheStorage, url: string) => {
  const cache = await open(caches);
  const res = await cache.match(url);
  if (!res) {
    return;
  }
  return await res.blob();
};

export const getBlobOrThrow = async (caches: CacheStorage, url: string) => {
  const result = await getBlob(caches, url);
  if (!result) {
    throw new Error(`Missing ${url}`);
  }
  return result;
};

export const getResponse = async (caches: CacheStorage, url: string) => {
  const cache = await open(caches);
  return cache.match(url);
};

const APP_CACHES_PREFIX_LENGTH = APP_CACHES_PREFIX.length;

export const stripPrefix = (s: string) => {
  return s.startsWith(APP_CACHES_PREFIX) ? s.substring(APP_CACHES_PREFIX_LENGTH) : s;
};
