import { and, eq } from 'drizzle-orm';
import { genAnnouncementID } from '../../utils/genAnnouncementID';
import { getChannel } from '../channel/getChannel';
import type { DBContext } from '../db';
import { announcementsTable, channelsTable } from '../schema';
import { putStorage } from '../storage/putStorage';

type Params = {
  userID: string;
  channelID: string;
  headerImage?: Blob | undefined;
  title?: string | undefined;
  body: string;
  images?: Blob[] | undefined;
  createdAt: number;
};

export const addAnnouncement = async (
  ctx: DBContext,
  { userID, channelID, headerImage, title, body, images, createdAt }: Params,
) => {
  const channel = await getChannel(ctx, { userID, channelID });
  if (!channel) {
    return;
  }

  const values: Omit<typeof announcementsTable.$inferInsert, 'announcementID'> = {
    userID,
    channelID,
    body,
    updatedAt: createdAt,
    createdAt,
  };

  if (title) {
    values.title = title;
  }

  const storagePuts = [];

  if (headerImage) {
    storagePuts.push(
      putStorage(ctx, headerImage).then((v) => {
        values.headerImage = v;
      }),
    );
  }

  if (images) {
    const a: string[] = [];
    values.images = a;
    images.forEach((image, i) => {
      storagePuts.push(
        putStorage(ctx, image).then((v) => {
          a[i] = v;
        }),
      );
    });
  }

  await Promise.all(storagePuts);

  const announcementID = genAnnouncementID(values.createdAt);

  // Check duplicated
  if (channel.announcementIDs?.includes(announcementID)) {
    return;
  }

  const announcementIDs = [announcementID, ...(channel.announcementIDs ?? [])];

  const db = ctx.db;

  const updateChannel = db
    .update(channelsTable)
    .set({
      announcementIDs,
      updatedAt: new Date().getTime(),
    })
    .where(
      and(eq(channelsTable.channelID, channelID), eq(channelsTable.updatedAt, channel.updatedAt)),
    );

  const announcementValues = { announcementID, ...values };

  await db.batch([updateChannel, db.insert(announcementsTable).values(announcementValues)]);

  return announcementValues;
};
