import { Miniflare, Request as MiniflareRequest, Response as MiniflareResponse } from 'miniflare';
import { resolve } from 'node:path';
import {
  type CFCache,
  type CFCacheStorage,
  type CFD1Database,
  type CFKVNamespace,
  type CFR2Bucket,
  type CFRequestInfo,
  type CFResponse,
} from './cloudflareTypes';
import { getWranglerLocalEnv } from './wranglerEnv';

type MiniflareCache = Awaited<ReturnType<Miniflare['getCaches']>>['default'];

const LOCAL_DIR = '../db-local/v3';

const localEnv = getWranglerLocalEnv();

export const createLocalPlatform = async () => {
  const path = `file://${resolve(LOCAL_DIR)}`;

  const mf = new Miniflare({
    modules: true,
    script: '',
    d1Persist: `${path}/d1`,
    r2Persist: `${path}/r2`,
    kvPersist: `${path}/kv`,
    d1Databases: { D1: localEnv.D1_ID, D1_NOTIFICATION: localEnv.D1_NOTIFICATION_ID },
    r2Buckets: { R2: localEnv.R2_BUCKET_NAME, R2_POST_LOG: localEnv.R2_POST_LOG_BUCKET_NAME },
    kvNamespaces: { KV_NOTIFICATION: localEnv.KV_NOTIFICATION_ID },
  });

  const bindings = await mf.getBindings<{
    D1: CFD1Database;
    D1_NOTIFICATION: CFD1Database;
    R2: CFR2Bucket;
    R2_POST_LOG: CFR2Bucket;
    KV_NOTIFICATION: CFKVNamespace;
  }>();

  const caches = await mf.getCaches();

  return {
    env: {
      ...bindings,
      SEND_EMAIL: {
        send(message) {
          console.log(message);
          return Promise.resolve();
        },
      } satisfies SendEmail,
    },
    caches: {
      open: (): Promise<CFCache> => {
        throw new Error('not implemented yet');
      },
      default: new CacheWrapper(caches.default),
    } as CFCacheStorage,
    context: {
      waitUntil: () => {
        //
      },
    },
    dispose: () => {
      return mf.dispose();
    },
  };
};

/**
  Since MiniflareCache has different type definitions than Cloudflare's Cache,
  pass through the type check error locations using `as unknown as`.
 */
class CacheWrapper implements CFCache {
  //
  constructor(private cache: MiniflareCache) {}
  delete(request: CFRequestInfo | URL, options?: CacheQueryOptions): Promise<boolean> {
    return this.cache.delete(request as unknown as MiniflareRequest, options);
  }
  async match(
    request: CFRequestInfo | URL,
    options?: CacheQueryOptions,
  ): Promise<CFResponse | undefined> {
    const res = await this.cache.match(request as unknown as MiniflareRequest, options);
    if (!res) {
      return;
    }

    /*
      Miniflare's Response is incompatible with the standard Response, so it must be recreated.
      Type checking also fails, so it passes through using `as unknown as`.
    */
    return new Response(
      res.body as unknown as BodyInit,
      res as unknown as Response,
    ) as unknown as CFResponse;
  }

  put(request: CFRequestInfo | URL, response: CFResponse): Promise<void> {
    // https://github.com/cloudflare/workers-sdk/issues/4361
    const mfResponse = new MiniflareResponse(response.body, {
      status: response.status,
      headers: [...response.headers.entries()],
    });
    return this.cache.put(request as unknown as MiniflareRequest, mfResponse);
  }
}
