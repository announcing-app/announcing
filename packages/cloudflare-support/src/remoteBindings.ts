import { Miniflare } from 'miniflare';
import { experimental_maybeStartOrUpdateRemoteProxySession } from 'wrangler';
import { getWranglerRemoteEnv } from './wranglerEnv';

// https://developers.cloudflare.com/workers/development-testing/#using-vitest-with-remote-bindings

const remoteEnv = getWranglerRemoteEnv();

export const createRemoteBindings = async () => {
  const remoteProxy = await experimental_maybeStartOrUpdateRemoteProxySession({
    bindings: {
      D1: {
        type: 'd1',
        database_id: remoteEnv.D1_ID,
        experimental_remote: true,
      },
      D1_NOTIFICATION: {
        type: 'd1',
        database_id: remoteEnv.D1_NOTIFICATION_ID,
        experimental_remote: true,
      },
      R2: {
        type: 'r2_bucket',
        bucket_name: remoteEnv.R2_BUCKET_NAME,
        experimental_remote: true,
      },
      R2_POST_LOG: {
        type: 'r2_bucket',
        bucket_name: remoteEnv.R2_POST_LOG_BUCKET_NAME,
        experimental_remote: true,
      },
      KV_NOTIFICATION: {
        type: 'kv_namespace',
        id: remoteEnv.KV_NOTIFICATION_ID,
        experimental_remote: true,
      },
    },
  });

  if (!remoteProxy) {
    throw new Error('start remoteProxy error');
  }

  const remoteProxyConnectionString = remoteProxy.session.remoteProxyConnectionString;

  const mf = new Miniflare({
    modules: true,
    script: '',
    d1Databases: {
      D1: { id: remoteEnv.D1_ID, remoteProxyConnectionString },
      D1_NOTIFICATION: { id: remoteEnv.D1_NOTIFICATION_ID, remoteProxyConnectionString },
    },
    r2Buckets: {
      R2: { id: remoteEnv.R2_BUCKET_NAME, remoteProxyConnectionString },
      R2_POST_LOG: { id: remoteEnv.R2_POST_LOG_BUCKET_NAME, remoteProxyConnectionString },
    },
    kvNamespaces: {
      KV_NOTIFICATION: { id: remoteEnv.KV_NOTIFICATION_ID, remoteProxyConnectionString },
    },
  });

  const bindings = await mf.getBindings<{
    D1: D1Database;
    D1_NOTIFICATION: D1Database;
    R2: R2Bucket;
    R2_POST_LOG: R2Bucket;
    KV_NOTIFICATION: KVNamespace;
  }>();

  return {
    ...bindings,
    dispose: () => {
      return Promise.allSettled([mf.dispose(), remoteProxy.session.dispose()]);
    },
  };
};
