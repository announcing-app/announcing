import { openAsBlob } from 'node:fs';
import { expect, test } from 'vitest';
import { genStorageKey } from '../src/utils';

test('jpeg', async () => {
  const res = await genStorageKey(await openAsBlob('tests/board-361516_1280.jpg'));
  expect(res[0].endsWith('_1280x970.jpg')).toBeTruthy();
  expect(res[2]).toEqual('image/jpeg');
});

test('not image', async () => {
  const res = await genStorageKey(await openAsBlob('package.json', { type: 'text/plain' }));
  expect(res[2]).toEqual('text/plain');
});
