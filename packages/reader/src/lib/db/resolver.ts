import type { GetAnnouncementResult, GetChannelResult } from '@announcing/db/types';

export const resolveStoragePath = (s: string) => {
  if (!s.includes('/')) {
    return `/s/${s}`;
  }
  return s;
};

export const resolveChannel = (result: GetChannelResult): GetChannelResult => {
  if (result.icon) {
    result.icon = resolveStoragePath(result.icon);
  }

  return result;
};

export const resolveAnnouncement = (result: GetAnnouncementResult): GetAnnouncementResult => {
  if (result.headerImage) {
    result.headerImage = resolveStoragePath(result.headerImage);
  }
  if (result.images) {
    result.images = result.images.map((v) => {
      return resolveStoragePath(v);
    });
  }

  return result;
};
