import { sql } from 'drizzle-orm';
import { check, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  ANNOUNCEMENT_BODY_MAX_BYTES,
  ANNOUNCEMENT_ID_LENGTH,
  ANNOUNCEMENT_TITLE_MAX_BYTES,
  CHANNEL_DESC_MAX_BYTES,
  CHANNEL_ICON_MAX_BYTES,
  CHANNEL_ID_MAX_BYTES,
  CHANNEL_NAME_MAX_BYTES,
  STORAGE_ID_MAX_BYTES,
  USER_ID_MAX_BYTES,
} from '../constants';

export const channelsTable = sqliteTable(
  'channels',
  {
    channelID: text('channelID').notNull().primaryKey(),
    name: text('name').notNull(),
    desc: text('desc'),
    icon: text('icon'),
    announcementIDs: text('announcementIDs', { mode: 'json' }).$type<string[]>(),
    updatedAt: integer('updatedAt').notNull(),
    createdAt: integer('createdAt').notNull(),
  },
  (table) => {
    return [
      check(
        'channelID',
        sql`octet_length(${table.channelID}) BETWEEN 1 AND ${CHANNEL_ID_MAX_BYTES}`.inlineParams(),
      ),
      check(
        'name',
        sql`octet_length(${table.name}) BETWEEN 1 AND ${CHANNEL_NAME_MAX_BYTES}`.inlineParams(),
      ),
      check(
        'desc',
        sql`${table.desc} IS NULL OR octet_length(${table.desc}) <= ${CHANNEL_DESC_MAX_BYTES}`.inlineParams(),
      ),
      check(
        'icon',
        sql`${table.icon} IS NULL OR octet_length(${table.icon}) <= ${CHANNEL_ICON_MAX_BYTES}`.inlineParams(),
      ),
      check(
        'announcementIDs',
        sql`${table.announcementIDs} IS NULL OR json_type(${table.announcementIDs}) = 'array'`.inlineParams(),
      ),
    ];
  },
);

export const ownersTable = sqliteTable(
  'owners',
  {
    channelID: text('channelID')
      .notNull()
      .references(() => channelsTable.channelID, { onDelete: 'cascade' }),
    userID: text('userID').notNull(),
    createdAt: integer('createdAt').notNull(),
  },
  (table) => {
    return [
      primaryKey({ columns: [table.channelID, table.userID] }),
      check(
        'channelID',
        sql`octet_length(${table.channelID}) BETWEEN 1 AND ${CHANNEL_ID_MAX_BYTES}`.inlineParams(),
      ),
      check(
        'userID',
        sql`octet_length(${table.userID}) BETWEEN 1 AND ${USER_ID_MAX_BYTES}`.inlineParams(),
      ),
    ];
  },
);

export const announcementsTable = sqliteTable(
  'announcements',
  {
    channelID: text('channelID')
      .notNull()
      .references(() => channelsTable.channelID, { onDelete: 'cascade' }),
    userID: text('userID').notNull(),
    announcementID: text('announcementID').notNull(),
    headerImage: text('headerImage'),
    title: text('title'),
    body: text('body').notNull(),
    images: text('images', { mode: 'json' }).$type<string[]>(),
    updatedAt: integer('updatedAt').notNull(),
    createdAt: integer('createdAt').notNull(),
  },
  (table) => {
    return [
      primaryKey({ columns: [table.channelID, table.announcementID] }),
      check(
        'channelID',
        sql`octet_length(${table.channelID}) BETWEEN 1 AND ${CHANNEL_ID_MAX_BYTES}`.inlineParams(),
      ),
      check(
        'userID',
        sql`octet_length(${table.userID}) BETWEEN 1 AND ${USER_ID_MAX_BYTES}`.inlineParams(),
      ),
      check(
        'announcementID',
        sql`octet_length(${table.announcementID}) BETWEEN 1 AND ${ANNOUNCEMENT_ID_LENGTH}`.inlineParams(),
      ),
      check(
        'headerImage',
        sql`${table.headerImage} IS NULL OR octet_length(${table.headerImage}) <= ${STORAGE_ID_MAX_BYTES}`.inlineParams(),
      ),
      check(
        'title',
        sql`${table.title} IS NULL OR octet_length(${table.title}) <= ${ANNOUNCEMENT_TITLE_MAX_BYTES}`.inlineParams(),
      ),
      check(
        'body',
        sql`octet_length(${table.body}) BETWEEN 1 AND ${ANNOUNCEMENT_BODY_MAX_BYTES}`.inlineParams(),
      ),
      check(
        'images',
        sql`${table.images} IS NULL OR json_type(${table.images}) = 'array'`.inlineParams(),
      ),
    ];
  },
);
