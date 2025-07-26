import { and, eq } from 'drizzle-orm';
import type { DBContext } from '../db';
import { announcementsTable } from '../schema';

export const getAnnouncement = async (
  { db }: DBContext,
  {
    channelID,
    announcementID,
  }: {
    channelID: string;
    announcementID: string;
  },
) => {
  const { title, body, headerImage, images, updatedAt, createdAt } = announcementsTable;

  const announcement = (
    await db
      .select({
        title,
        body,
        headerImage,
        images,
        updatedAt,
        createdAt,
      })
      .from(announcementsTable)
      .where(
        and(
          eq(announcementsTable.channelID, channelID),
          eq(announcementsTable.announcementID, announcementID),
        ),
      )
  ).shift();

  if (!announcement) return;

  return {
    ...announcement,
    title: announcement.title ?? undefined,
    headerImage: announcement.headerImage ?? undefined,
    images: announcement.images ?? undefined,
  };
};
