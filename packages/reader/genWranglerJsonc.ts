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
  database_name: 'D1',
  database_id: localEnv.D1_ID,
};

const r2 = {
  binding: 'R2',
  bucket_name: localEnv.R2_BUCKET_NAME,
};

const putTokenService = {
  binding: 'WK_PUT_TOKEN',
  service: localEnv.NOTIFICATION_PROJECT_NAME,
  entrypoint: 'PutTokenEntrypoint',
};

const config: Unstable_RawConfig = {
  name: localEnv.READER_PROJECT_NAME,
  main: '.svelte-kit/cloudflare/_worker.js',
  compatibility_date: '2025-05-05',
  compatibility_flags: ['nodejs_compat_v2'],
  upload_source_maps: true,

  observability: {
    enabled: true,
    head_sampling_rate: 1,
  },

  assets: {
    binding: 'ASSETS',
    directory: '.svelte-kit/cloudflare',
  },

  d1_databases: [d1],
  r2_buckets: [r2],
  services: [putTokenService],
};

await writeFile('wrangler.local.jsonc', JSON.stringify(config, undefined, 2));

const remoteConfig: Unstable_RawConfig = {
  ...config,
  name: remoteEnv.READER_PROJECT_NAME,
  d1_databases: [{ ...d1, database_id: remoteEnv.D1_ID }],
  r2_buckets: [{ ...r2, bucket_name: remoteEnv.R2_BUCKET_NAME }],
  services: [{ ...putTokenService, service: remoteEnv.NOTIFICATION_PROJECT_NAME }],
};

await writeFile('wrangler.remote.jsonc', JSON.stringify(remoteConfig, undefined, 2));
