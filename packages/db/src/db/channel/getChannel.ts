import { and, eq, exists } from 'drizzle-orm';
import type { DBContext } from '../db';
import { channelsTable, ownersTable } from '../schema';

export const READER = Symbol('READER');

export const getChannel = async (
  { db }: DBContext,
  {
    userID,
    channelID,
  }: {
    userID: typeof READER | string;
    channelID: string;
  },
) => {
  const conditions = [eq(channelsTable.channelID, channelID)];
  if (userID !== READER) {
    conditions.push(
      exists(
        db
          .select()
          .from(ownersTable)
          .where(and(eq(ownersTable.channelID, channelID), eq(ownersTable.userID, userID))),
      ),
    );
  }

  const channel = (
    await db
      .select()
      .from(channelsTable)
      .where(and(...conditions))
  ).shift();

  if (!channel) return;

  return {
    ...channel,
    desc: channel.desc ?? undefined,
    icon: channel.icon ?? undefined,
    announcementIDs: channel.announcementIDs ?? undefined,
  };
};
