import { resolveChannel } from '$lib/db/resolver';
import type { GetChannelResult } from '@announcing/db/types';

export const fetchChannel = async (channelID: string, fetch_ = fetch, signal?: AbortSignal) => {
  const res = await fetch_(`/api/channels/${channelID}`, { ...(signal && { signal }) });
  if (res.ok) {
    const json: GetChannelResult = await res.json();
    const result = resolveChannel(json);

    return result;
  }

  if (res.status === 404) {
    return;
  }

  throw new Error(`Fetch Channel Error`);
};
