import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { addAnnouncement } from './announcement/addAnnouncement';
import { getAnnouncement } from './announcement/getAnnouncement';
import { removeAnnouncement } from './announcement/removeAnnouncement';
import { updateAnnouncement } from './announcement/updateAnnouncement';
import { createChannel } from './channel/createChannel';
import { deleteChannel } from './channel/deleteChannel';
import { getChannel } from './channel/getChannel';
import { getChannels } from './channel/getChannels';
import { updateChannel } from './channel/updateChannel';
import { getStorage } from './storage/getStorage';

export type DBContext = {
  db: DrizzleD1Database;
  r2: R2Bucket;
};
export const createDB = ({ D1, R2 }: { D1: D1Database; R2: R2Bucket }) => {
  const ctx: DBContext = {
    db: drizzle(D1),
    r2: R2,
  };

  return {
    createChannel: (params: Parameters<typeof createChannel>[1]) => {
      return createChannel(ctx, params);
    },
    updateChannel: (params: Parameters<typeof updateChannel>[1]) => {
      return updateChannel(ctx, params);
    },
    deleteChannel: (params: Parameters<typeof deleteChannel>[1]) => {
      return deleteChannel(ctx, params);
    },
    getChannel: (params: Parameters<typeof getChannel>[1]) => {
      return getChannel(ctx, params);
    },
    getChannels: (params: Parameters<typeof getChannels>[1]) => {
      return getChannels(ctx, params);
    },
    addAnnouncement: (params: Parameters<typeof addAnnouncement>[1]) => {
      return addAnnouncement(ctx, params);
    },
    updateAnnouncement: (params: Parameters<typeof updateAnnouncement>[1]) => {
      return updateAnnouncement(ctx, params);
    },
    removeAnnouncement: (params: Parameters<typeof removeAnnouncement>[1]) => {
      return removeAnnouncement(ctx, params);
    },
    getAnnouncement: (params: Parameters<typeof getAnnouncement>[1]) => {
      return getAnnouncement(ctx, params);
    },
    getStorage: (params: Parameters<typeof getStorage>[1]) => {
      return getStorage(ctx, params);
    },
  };
};
