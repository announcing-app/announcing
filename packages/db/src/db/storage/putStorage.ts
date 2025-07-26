import { genStorageKey } from '../../utils';
import type { DBContext } from '../db';

export const putStorage = async ({ r2 }: DBContext, blob: Blob) => {
  const [key, ab] = await genStorageKey(blob);

  const res = await r2.head(key);
  if (res) {
    return key;
  }

  await r2.put(key, ab, {
    httpMetadata: {
      contentType: blob.type,
    },
  });

  return key;
};
