import { resolveAnnouncement } from '$lib/db/resolver';
import type { GetAnnouncementResult } from '@announcing/db/types';
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, GetAnnouncementResult>({ max: 100 });

export const fetchAnnouncement = (
  {
    channelID,
    announcementID,
  }: {
    channelID: string;
    announcementID: string;
  },
  fetch_ = fetch,
): GetAnnouncementResult | Promise<GetAnnouncementResult | undefined> => {
  const cacheKey = `${channelID}-${announcementID}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const url = `/api/channels/${channelID}/announcements/${announcementID}`;

  return (async () => {
    const res = await fetch_(url, { cache: 'force-cache' });
    if (res.ok) {
      const data = resolveAnnouncement(await res.json());
      cache.set(cacheKey, data);
      return data;
    }

    if (res.status === 404) {
      return undefined;
    }

    throw new Error(`Fetch Announcement Error: ${cacheKey}`);
  })();
};
