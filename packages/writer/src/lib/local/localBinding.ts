import { GOOGLE_CREDENTIALS_BASE64 } from '$env/static/private';
import {
  createWorkerEntrypointLocal,
  createWorkflowLocal,
} from '@announcing/cloudflare-support/local';
import { getWranglerLocalEnv } from '@announcing/cloudflare-support/wranglerEnv';
import { SendNotificationEntrypoint } from '@announcing/notification';
import { Miniflare } from 'miniflare';
import { resolve } from 'node:path';
import { StorePostLogWorkflowEntrypoint } from '../../workers/storePostLogWorkflow';

const LOCAL_DIR = '../db-local/v3';

const localEnv = getWranglerLocalEnv();

export const createLocalBindings = async () => {
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
    D1: D1Database;
    D1_NOTIFICATION: D1Database;
    R2: R2Bucket;
    R2_POST_LOG: R2Bucket;
    KV_NOTIFICATION: KVNamespace;
  }>();

  const WF_STORE_POST_LOG = createWorkflowLocal(StorePostLogWorkflowEntrypoint, bindings);

  const SEND_NOTIFICATION = ((): SendNotificationEntrypoint => {
    if (!GOOGLE_CREDENTIALS_BASE64) {
      return {
        sendNotification: () => {
          return Promise.resolve({ id: '' });
        },
      } as unknown as SendNotificationEntrypoint;
    }

    return createWorkerEntrypointLocal(SendNotificationEntrypoint, {
      ...bindings,
      GOOGLE_CREDENTIALS_BASE64,
    });
  })();

  return { ...bindings, WF_STORE_POST_LOG, SEND_NOTIFICATION };
};
