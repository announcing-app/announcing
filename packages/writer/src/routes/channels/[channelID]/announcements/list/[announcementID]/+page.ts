import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const { channelID, announcementID } = params;

  const announcement = await fetchAnnouncement({ channelID, announcementID }, fetch);
  if (!announcement) {
    redirect(303, `/channels/${channelID}/announcements/list`);
  }

  return {
    channelID,
    announcementID,
    announcement,
  };
};
