import type { RequestEvent } from '@sveltejs/kit';
import { describe, expect, it, vi } from 'vitest';
import { initCacheHandle } from '../src/cacheHandle/cacheHandle';
import type { CacheHandleOptions } from '../src/cacheHandle/types';

const createMockCaches = () => {
  const store = new Map<string, Response>();
  return {
    default: {
      // eslint-disable-next-line @typescript-eslint/require-await
      match: vi.fn(async (key: string) => store.get(key) || undefined),
      // eslint-disable-next-line @typescript-eslint/require-await
      put: vi.fn(async (key: string, response: Response) => {
        store.set(key, response.clone());
      }),
      // eslint-disable-next-line @typescript-eslint/require-await
      delete: vi.fn(async (key: string) => store.delete(key)),
    },
    store,
  };
};

const createMockEvent = (url: string): Pick<RequestEvent, 'url'> => ({
  url: new URL(url),
});

// eslint-disable-next-line @typescript-eslint/require-await
const createMockResolve = (body: string) => vi.fn(async () => new Response(body));

const createRouteMatcher = (path: string, key: string, cacheControl: string) => ({
  match: (url: URL) => {
    if (path.endsWith('*')) {
      if (url.pathname.startsWith(path.slice(0, -1))) {
        return { key, cacheControl };
      }
    } else {
      if (url.pathname === path) {
        return { key, cacheControl };
      }
    }
    return undefined;
  },
});

describe('initCacheHandle', () => {
  it('should return original response and cache it on cache miss', async () => {
    const mockCaches = createMockCaches();
    const waitUntil = vi.fn();
    const resolve = createMockResolve('fresh content');
    const route = createRouteMatcher('/cacheable', 'cache-key-1', 'public, max-age=3600');

    const options: CacheHandleOptions = {
      caches: mockCaches as unknown as CacheStorage,
      waitUntil,
      routes: [route],
    };

    const handle = initCacheHandle(options);
    const event = createMockEvent('https://example.com/cacheable');

    const response = await handle({ event: event as RequestEvent, resolve });
    const body = await response.text();

    expect(body).toBe('fresh content');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600');
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(mockCaches.default.match).toHaveBeenCalledWith('cache-key-1');
    expect(waitUntil).toHaveBeenCalledTimes(1);
    expect(mockCaches.default.put).toHaveBeenCalledWith('cache-key-1', expect.any(Response));

    // Verify it was actually cached
    const cached = await mockCaches.default.match('cache-key-1');
    expect(cached).toBeDefined();
    if (cached) {
      const cachedBody = await cached.text();
      expect(cachedBody).toBe('fresh content');
      expect(cached.headers.get('Cache-Control')).toBe('public, max-age=3600');
    }
  });

  it('should return cached response on cache hit', async () => {
    const mockCaches = createMockCaches();
    const initialResponse = new Response('cached content', {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    });
    mockCaches.store.set('cache-key-2', initialResponse);

    const waitUntil = vi.fn();
    const resolve = createMockResolve('fresh content');
    const route = createRouteMatcher('/cacheable', 'cache-key-2', 'public, max-age=3600');

    const options: CacheHandleOptions = {
      caches: mockCaches as unknown as CacheStorage,
      waitUntil,
      routes: [route],
    };

    const handle = initCacheHandle(options);
    const event = createMockEvent('https://example.com/cacheable');

    const response = await handle({ event: event as RequestEvent, resolve });
    const body = await response.text();

    expect(body).toBe('cached content');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600');
    expect(mockCaches.default.match).toHaveBeenCalledWith('cache-key-2');
    expect(resolve).not.toHaveBeenCalled();
    expect(waitUntil).not.toHaveBeenCalled();
    expect(mockCaches.default.put).not.toHaveBeenCalled();
  });

  it('should bypass cache for non-cacheable routes', async () => {
    const mockCaches = createMockCaches();
    const waitUntil = vi.fn();
    const resolve = createMockResolve('fresh content');
    const route = createRouteMatcher('/cacheable', 'cache-key-3', 'no-cache');

    const options: CacheHandleOptions = {
      caches: mockCaches as unknown as CacheStorage,
      waitUntil,
      routes: [route],
    };

    const handle = initCacheHandle(options);
    const event = createMockEvent('https://example.com/not-cacheable');

    const response = await handle({ event: event as RequestEvent, resolve });
    const body = await response.text();

    expect(body).toBe('fresh content');
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(mockCaches.default.match).not.toHaveBeenCalled();
    expect(waitUntil).not.toHaveBeenCalled();
    expect(mockCaches.default.put).not.toHaveBeenCalled();
  });

  it('should match the correct route when multiple routes are provided', async () => {
    const mockCaches = createMockCaches();
    const waitUntil = vi.fn();
    const resolve = createMockResolve('fresh content from second route');
    const route1 = createRouteMatcher('/first', 'cache-key-first', 'public, max-age=60');
    const route2 = createRouteMatcher('/second', 'cache-key-second', 'private, max-age=300');

    const options: CacheHandleOptions = {
      caches: mockCaches as unknown as CacheStorage,
      waitUntil,
      routes: [route1, route2],
    };

    const handle = initCacheHandle(options);
    const event = createMockEvent('https://example.com/second');

    const response = await handle({ event: event as RequestEvent, resolve });
    const body = await response.text();

    expect(body).toBe('fresh content from second route');
    expect(mockCaches.default.match).toHaveBeenCalledWith('cache-key-second');
    expect(waitUntil).toHaveBeenCalledTimes(1);
    expect(mockCaches.default.put).toHaveBeenCalledWith('cache-key-second', expect.any(Response));
    expect(response.headers.get('Cache-Control')).toBe('private, max-age=300');
  });

  it('should prioritize the first matching route in the array (specific first)', async () => {
    const mockCaches = createMockCaches();
    const waitUntil = vi.fn();
    const resolve = createMockResolve('fresh content');
    const routeSpecific = createRouteMatcher('/a/b/*', 'key-specific', 'max-age=60');
    const routeGeneral = createRouteMatcher('/a/*', 'key-general', 'max-age=300');

    const options: CacheHandleOptions = {
      caches: mockCaches as unknown as CacheStorage,
      waitUntil,
      routes: [routeSpecific, routeGeneral],
    };

    const handle = initCacheHandle(options);
    const event = createMockEvent('https://example.com/a/b/hoge');

    const response = await handle({ event: event as RequestEvent, resolve });

    expect(mockCaches.default.match).toHaveBeenCalledWith('key-specific');
    expect(response.headers.get('Cache-Control')).toBe('max-age=60');
  });

  it('should prioritize the first matching route in the array (general first)', async () => {
    const mockCaches = createMockCaches();
    const waitUntil = vi.fn();
    const resolve = createMockResolve('fresh content');
    const routeSpecific = createRouteMatcher('/a/b/*', 'key-specific', 'max-age=60');
    const routeGeneral = createRouteMatcher('/a/*', 'key-general', 'max-age=300');

    const options: CacheHandleOptions = {
      caches: mockCaches as unknown as CacheStorage,
      waitUntil,
      routes: [routeGeneral, routeSpecific],
    };

    const handle = initCacheHandle(options);
    const event = createMockEvent('https://example.com/a/b/hoge');

    const response = await handle({ event: event as RequestEvent, resolve });

    expect(mockCaches.default.match).toHaveBeenCalledWith('key-general');
    expect(response.headers.get('Cache-Control')).toBe('max-age=300');
  });
});
