import { type CacheHandler } from '$lib/platform/cache';
import { READER, type DBHandler } from '@announcing/db';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const validIcon = async (
  cache: CacheHandler,
  getChannel: DBHandler['getChannel'],
  channelID: string,
  imgID: string,
) => {
  const cacheKey = `db/channels/${channelID}/icon/${imgID}`;

  const match = await cache.match(cacheKey);
  if (match) {
    return match.ok;
  }

  const channel = await getChannel({ userID: READER, channelID });
  if (!channel || channel.icon !== imgID) {
    cache.put(cacheKey, null, 60, true);
    return false;
  }

  cache.put(cacheKey, null, 3600);

  return true;
};

const loadIcon = async (
  cache: CacheHandler,
  getStorage: DBHandler['getStorage'],
  imgID: string,
) => {
  const cacheKey = `storage/${imgID}`;

  const match = await cache.match(cacheKey);
  if (match) {
    return match;
  }

  const icon = await getStorage(imgID);
  if (!icon) {
    cache.put(cacheKey, null, 86400, true);
    return error(404);
  }

  const { contentType, body, contentLength } = icon;

  const res = new Response(body as ReadableStream<Uint8Array>, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': contentLength.toString(),
      'Cache-Control': 'public, immutable, max-age=31536000',
    },
  });

  cache.putResponse(cacheKey, res.clone());

  return res;
};

export const GET: RequestHandler = async ({ params, locals }) => {
  const { channelID, imgID } = params;

  const isValidIcon = await validIcon(locals.cache, locals.db.getChannel, channelID, imgID);
  if (!isValidIcon) {
    return error(404);
  }

  return await loadIcon(locals.cache, locals.db.getStorage, imgID);
};
