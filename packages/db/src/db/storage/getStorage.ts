import type { CFReadableStream } from '@announcing/cloudflare-support/cloudflareTypes';
import type { DBContext } from '../db';

type Result = {
  contentType: string;
  contentLength: number;
  body: CFReadableStream;
};

export const getStorage = async ({ r2 }: DBContext, key: string): Promise<Result | undefined> => {
  const res = await r2.get(key);
  if (!res) {
    return;
  }

  return {
    contentType: res.httpMetadata?.contentType ?? '',
    contentLength: res.size,
    body: res.body,
  };
};
