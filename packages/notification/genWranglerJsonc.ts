import {
  getWranglerLocalEnv,
  getWranglerRemoteEnv,
} from '@announcing/cloudflare-support/wranglerEnv';
import { writeFile } from 'node:fs/promises';
import type { Unstable_RawConfig } from 'wrangler';

const localEnv = getWranglerLocalEnv();
const remoteEnv = getWranglerRemoteEnv();

const d1Notification = {
  binding: 'D1_NOTIFICATION',
  database_name: 'd1-notification',
  database_id: localEnv.D1_NOTIFICATION_ID,
  migrations_dir: './migrations',
};

const kvNotification = {
  binding: 'KV_NOTIFICATION',
  id: localEnv.KV_NOTIFICATION_ID,
};

const config: Unstable_RawConfig = {
  name: localEnv.NOTIFICATION_PROJECT_NAME,
  main: 'src/workers/index.ts',
  compatibility_date: '2025-05-05',
  compatibility_flags: ['nodejs_compat_v2'],
  upload_source_maps: true,

  d1_databases: [d1Notification],
  kv_namespaces: [kvNotification],
};

await writeFile('wrangler.local.jsonc', JSON.stringify(config, undefined, 2));

const remoteConfig = {
  ...config,
  name: remoteEnv.NOTIFICATION_PROJECT_NAME,
  d1_databases: [{ ...d1Notification, database_id: remoteEnv.D1_NOTIFICATION_ID }],
  kv_namespaces: [{ ...kvNotification, id: remoteEnv.KV_NOTIFICATION_ID }],
};

await writeFile('wrangler.remote.jsonc', JSON.stringify(remoteConfig, undefined, 2));
