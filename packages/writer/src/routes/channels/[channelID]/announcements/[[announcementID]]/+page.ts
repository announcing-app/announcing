import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent, fetch }) => {
  const { channelID, announcementID } = params;
  const parentData = await parent();
  const channel = parentData.channel;

  if (!announcementID) {
    // Create New Announcement
    return {
      channel,
      channelID,
      announcement: undefined,
      backHref: `/channels/${channelID}`,
    };
  }

  if (!channel.announcementIDs || channel.announcementIDs.indexOf(announcementID) < 0) {
    redirect(303, `/channels/${channelID}/announcements/list`);
  }

  const announcement = announcementID
    ? await fetchAnnouncement({ channelID, announcementID }, fetch)
    : undefined;

  if (!announcement) {
    redirect(303, `/channels/${channelID}/announcements/list`);
  }

  return {
    channel,
    channelID,
    announcementID,
    announcement,
    backHref: `/channels/${channelID}/announcements/list/${announcementID}`,
  };
};
