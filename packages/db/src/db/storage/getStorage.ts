import type { DBContext } from '../db';

type Result = {
  contentType: string;
  contentLength: number;
  body: ReadableStream;
};

export const getStorage = async ({ r2 }: DBContext, key: string): Promise<Result | undefined> => {
  const res = await r2.get(key);
  if (!res) {
    return;
  }

  return {
    contentType: res.httpMetadata?.contentType ?? '',
    contentLength: res.size,
    // Cloudflare's ReadableStream has a separate type but is runtime-compatible.
    body: res.body as unknown as ReadableStream,
  };
};
