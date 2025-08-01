import {
  getWranglerLocalEnv,
  getWranglerRemoteEnv,
} from '@announcing/cloudflare-support/wranglerEnv';
import { writeFile } from 'node:fs/promises';
import type { Unstable_RawConfig } from 'wrangler';

const localEnv = getWranglerLocalEnv();
const remoteEnv = getWranglerRemoteEnv();

const config: Unstable_RawConfig = {
  name: localEnv.HELP_PROJECT_NAME,
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
};

await writeFile('wrangler.local.jsonc', JSON.stringify(config, undefined, 2));

const remoteConfig: Unstable_RawConfig = {
  ...config,
  name: remoteEnv.HELP_PROJECT_NAME,
};

await writeFile('wrangler.remote.jsonc', JSON.stringify(remoteConfig, undefined, 2));
