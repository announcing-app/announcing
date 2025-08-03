import { fetchChannel } from '$lib/fetch/fetchChannel';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, fetch }) => {
  const { channelID } = params;

  const channel = await fetchChannel(channelID, fetch);

  return {
    channel,
    channelID,
    headerNotification: {
      channelID,
    },
  };
};
