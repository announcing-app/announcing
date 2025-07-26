import { and, eq, exists } from 'drizzle-orm';
import type { DBContext } from '../db';
import { channelsTable, ownersTable } from '../schema';

export const deleteChannel = async (
  { db }: DBContext,
  {
    userID,
    channelID,
    updatedAt,
  }: {
    userID: string;
    channelID: string;
    updatedAt: number;
  },
) => {
  await db.delete(channelsTable).where(
    and(
      eq(channelsTable.channelID, channelID),
      eq(channelsTable.updatedAt, updatedAt),
      exists(
        db
          .select()
          .from(ownersTable)
          .where(and(eq(ownersTable.channelID, channelID), eq(ownersTable.userID, userID))),
      ),
    ),
  );
};
