import {
  getWranglerLocalEnv,
  getWranglerRemoteEnv,
} from '@announcing/cloudflare-support/wranglerEnv';
import { writeFile } from 'node:fs/promises';
import type { Unstable_RawConfig } from 'wrangler';

const localEnv = getWranglerLocalEnv();
const remoteEnv = getWranglerRemoteEnv();

const d1 = {
  binding: 'D1',
  database_name: 'd1',
  database_id: localEnv.D1_ID,
  migrations_dir: './migrations',
};

const r2 = {
  binding: 'R2',
  bucket_name: localEnv.R2_BUCKET_NAME,
};

const config: Unstable_RawConfig = {
  d1_databases: [d1],
  r2_buckets: [r2],
};

await writeFile('wrangler.local.jsonc', JSON.stringify(config, undefined, 2));

const remoteConfig: Unstable_RawConfig = {
  ...config,
  d1_databases: [{ ...d1, database_id: remoteEnv.D1_ID }],
  r2_buckets: [{ ...r2, bucket_name: remoteEnv.R2_BUCKET_NAME }],
};

await writeFile('wrangler.remote.jsonc', JSON.stringify(remoteConfig, undefined, 2));
