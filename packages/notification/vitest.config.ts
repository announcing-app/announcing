import { virtualCloudflareWorkers } from '@announcing/cloudflare-support/vitePlugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [virtualCloudflareWorkers],
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
