import type { GetAnnouncementResult, GetChannelResult } from '@announcing/db/types';

export const resolveStoragePath = (s: string) => {
  if (!s.includes('/')) {
    return `/s/${s}`;
  }
  return s;
};

export const resolveChannel = (result: GetChannelResult): GetChannelResult => {
  if (result.icon) {
    result.icon = `/media/channels/${result.channelID}/icon/${result.icon}`;
  }

  return result;
};

export const resolveAnnouncement = (
  channelID: string,
  announcementID: string,
  result: GetAnnouncementResult,
): GetAnnouncementResult => {
  if (result.headerImage) {
    result.headerImage = `/media/channels/${channelID}/announcements/${announcementID}/images/${result.headerImage}`;
  }
  if (result.images) {
    result.images = result.images.map((v) => {
      return `/media/channels/${channelID}/announcements/${announcementID}/images/${v}`;
    });
  }

  return result;
};
