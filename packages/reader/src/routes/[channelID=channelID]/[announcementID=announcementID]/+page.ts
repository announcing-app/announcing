import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent, fetch }) => {
  const { channelID, announcementID } = params;

  const { channel } = await parent();
  if (!channel) {
    error(404, 'channel');
  }

  const announcement = await fetchAnnouncement({ channelID, announcementID }, fetch);

  if (!announcement) {
    error(404);
  }

  return {
    channelID,
    announcementID,
    channel,
    announcement,
  };
};
