import { virtualCloudflareWorkers } from '@announcing/cloudflare-support/vitePlugin';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const sourceMapsUploadOptions = (() => {
  const { SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN } = process.env;

  if (SENTRY_ORG && SENTRY_PROJECT && SENTRY_AUTH_TOKEN) {
    console.log('Add sourceMapsUploadOptions');
    return { org: SENTRY_ORG, project: SENTRY_PROJECT, authToken: SENTRY_AUTH_TOKEN };
  }
  return;
})();

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      ...(sourceMapsUploadOptions && { sourceMapsUploadOptions }),
    }),
    sveltekit(),
    virtualCloudflareWorkers,
  ],
  build: {
    minify: true,
    sourcemap: true,

    // https://github.com/sveltejs/kit/issues/11416#issuecomment-2338417698
    rollupOptions: {
      external: ['fsevents'],
    },
  },
  server: {
    host: '0.0.0.0',
  },
});
