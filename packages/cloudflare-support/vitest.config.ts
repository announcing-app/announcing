import { defineConfig } from 'vitest/config';
import { virtualCloudflareWorkers } from './src/vitePlugin';

export default defineConfig({
  plugins: [virtualCloudflareWorkers],
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
