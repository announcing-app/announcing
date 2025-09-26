export type CacheRoute = {
  match: (path: string) => string | undefined;
};

export type CacheHandleOptions = {
  routes: CacheRoute[];
};
