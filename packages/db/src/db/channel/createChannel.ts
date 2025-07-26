import { count, eq } from 'drizzle-orm';

import type { DBContext } from '../db';
import { channelsTable, ownersTable } from '../schema';
import { putStorage } from '../storage/putStorage';

type Params = {
  userID: string;
  channelID: string;
  name: string;
  desc: string | undefined;
  icon: Blob | undefined;
};

export const createChannel = async (
  ctx: DBContext,
  { userID, channelID, name, desc, icon }: Params,
) => {
  const db = ctx.db;

  {
    // This should ideally be enforced by a database trigger.
    const c = (
      await db.select({ count: count() }).from(ownersTable).where(eq(ownersTable.userID, userID))
    ).shift();
    if (c && c.count >= 5) {
      return;
    }
  }

  const now = new Date().getTime();

  const values: typeof channelsTable.$inferInsert = {
    channelID,
    name,
    desc: desc ?? null,
    updatedAt: now,
    createdAt: now,
  };

  if (icon) {
    values.icon = await putStorage(ctx, icon);
  }

  await db.batch([
    db.insert(channelsTable).values(values),
    db.insert(ownersTable).values({ channelID, userID, createdAt: now }),
  ]);
};
