export type CacheRoute = {
  match: (url: URL) => { key: string; cacheControl: string } | undefined;
};

export type CacheHandleOptions = {
  caches: CacheStorage;
  routes: CacheRoute[];
  waitUntil: (promise: Promise<unknown>) => void;
};
