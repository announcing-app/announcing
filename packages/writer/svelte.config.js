// @ts-check

import adapterCF from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapterCF({
      routes: {
        include: ['/*'],
        exclude: ['<all>'],
      },
    }),
    csrf: {
      checkOrigin: false,
    },
  },

  compilerOptions: {
    runes: true,
  },
};

export default config;
