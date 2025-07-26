import { browser } from '$app/environment';
import { resolveChannel } from '$lib/db/resolver';
import type { GetChannelResult } from '@announcing/db/types';
import { getChannelsCache, setChannelsCache } from './channelCache';

export const fetchChannels = async (fetch_ = fetch) => {
  const cache = getChannelsCache();
  if (cache) {
    return cache;
  }

  const res = await fetch_('/api/channels');
  if (res.ok) {
    const json: GetChannelResult[] = await res.json();

    const result = json.map((v) => {
      return resolveChannel(v);
    });

    if (browser) {
      setChannelsCache(result);
    }

    return result;
  }

  if (res.status === 400) {
    return;
  }

  throw new Error(`Fetch Channels Error`);
};
