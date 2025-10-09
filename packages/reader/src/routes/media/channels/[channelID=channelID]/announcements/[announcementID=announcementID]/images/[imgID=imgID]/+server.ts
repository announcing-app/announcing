import { type CacheHandler } from '$lib/platform/cache';
import { type DBHandler } from '@announcing/db';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const validImages = async (
  cache: CacheHandler,
  getAnnouncement: DBHandler['getAnnouncement'],
  channelID: string,
  announcementID: string,
  imgID: string,
) => {
  const cacheKey = `db/channels/${channelID}/announcements/${announcementID}/images/${imgID}`;

  const match = await cache.match(cacheKey);
  if (match) {
    return match.ok;
  }

  const announcement = await getAnnouncement({ channelID, announcementID });

  const valid = (() => {
    if (!announcement) {
      return false;
    }
    if (imgID === announcement.headerImage) {
      return true;
    }
    if (announcement.images?.includes(imgID)) {
      return true;
    }
    return false;
  })();

  if (!valid) {
    cache.put(cacheKey, null, 60, true);
    return false;
  }

  cache.put(cacheKey, null, 3600);

  return true;
};

const loadImage = async (
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
  const { channelID, announcementID, imgID } = params;

  const isValidImage = await validImages(
    locals.cache,
    locals.db.getAnnouncement,
    channelID,
    announcementID,
    imgID,
  );
  if (!isValidImage) {
    return error(404);
  }

  return await loadImage(locals.cache, locals.db.getStorage, imgID);
};
