import { describe, expect, it, vi } from 'vitest';
import { initCacheHandle } from '../src/cacheHandle/cacheHandle';
import type { CacheHandleOptions } from '../src/cacheHandle/types';

const createMockCaches = () => {
  const store = new Map<string, Response>();
  return {
    default: {
      match: vi.fn(async (key: string) => store.get(key) || undefined),
      put: vi.fn(async (key: string, response: Response) => {
        store.set(key, response.clone());
      }),
      delete: vi.fn(async (key: string) => store.delete(key)),
    },
    store,
  };
};

const createMockEvent = (url: string) => ({
  url: new URL(url),
  // ... other event properties can be mocked here if needed
});

const createMockResolve = (body: string) => vi.fn(async () => new Response(body));

const createRouteMatcher = (path: string, key: string, cacheControl: string) => ({
  match: (url: URL) => {
    if (url.pathname === path) {
      return { key, cacheControl };
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
      caches: mockCaches as any,
      waitUntil,
      routes: [route],
    };

    const handle = initCacheHandle(options);
    const event = createMockEvent('https://example.com/cacheable');

    const response = await handle({ event, resolve } as any);
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
    const cachedBody = await cached!.text();
    expect(cachedBody).toBe('fresh content');
    expect(cached!.headers.get('Cache-Control')).toBe('public, max-age=3600');
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
      caches: mockCaches as any,
      waitUntil,
      routes: [route],
    };

    const handle = initCacheHandle(options);
    const event = createMockEvent('https://example.com/cacheable');

    const response = await handle({ event, resolve } as any);
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
      caches: mockCaches as any,
      waitUntil,
      routes: [route],
    };

    const handle = initCacheHandle(options);
    const event = createMockEvent('https://example.com/not-cacheable');

    const response = await handle({ event, resolve } as any);
    const body = await response.text();

    expect(body).toBe('fresh content');
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(mockCaches.default.match).not.toHaveBeenCalled();
    expect(waitUntil).not.toHaveBeenCalled();
    expect(mockCaches.default.put).not.toHaveBeenCalled();
  });
});
