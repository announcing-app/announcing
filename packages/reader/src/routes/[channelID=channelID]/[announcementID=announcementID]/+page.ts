import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent, fetch }) => {
  const { channelID, announcementID } = params;

  const announcement = await fetchAnnouncement({ channelID, announcementID }, fetch);

  if (!announcement) {
    error(404);
  }

  const parentData = await parent();

  return {
    channelID,
    announcementID,
    channel: parentData.channel,
    announcement,
  };
};
