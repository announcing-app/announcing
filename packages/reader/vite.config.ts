import { virtualCloudflareWorkers } from '@announcing/cloudflare-support/vitePlugin';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit(), virtualCloudflareWorkers],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
  build: {
    minify: true,
    sourcemap: true,

    // https://github.com/sveltejs/kit/issues/11416#issuecomment-2338417698
    rollupOptions: {
      external: ['fsevents', 'cloudflare:email'],
    },
  },
  server: {
    host: '0.0.0.0',
    fs: {
      // https://vite.dev/config/server-options.html#server-fs-allow
      allow: ['..'],
    },
  },
});
