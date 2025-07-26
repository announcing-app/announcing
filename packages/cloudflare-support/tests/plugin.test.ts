import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { build } from 'vite';
import { expect, it } from 'vitest';
import { virtualCloudflareWorkers } from '../src/vitePlugin';

it('build with plugin', async () => {
  const outDir = resolve(__dirname, './dist');

  await build({
    configFile: false,
    plugins: [virtualCloudflareWorkers],
    build: {
      lib: {
        fileName: 'plugin-test',
        entry: resolve(__dirname, './plugin.fixture.ts'),
        formats: ['es'],
      },
      outDir,
      emptyOutDir: true,
    },
  });

  expect(existsSync(`${outDir}/plugin-test.js`)).toBe(true);
});
