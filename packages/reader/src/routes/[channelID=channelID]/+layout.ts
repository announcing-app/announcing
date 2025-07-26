import { fetchChannel } from '$lib/fetch/fetchChannel';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, fetch }) => {
  const { channelID } = params;

  const channel = await fetchChannel(channelID, fetch);

  if (!channel) {
    error(404);
  }

  return {
    channel,
    channelID,
    headerNotification: {
      channelID,
    },
  };
};
