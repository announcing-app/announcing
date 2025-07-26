import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tokensTable = sqliteTable('tokens', {
  token: text('token').notNull().primaryKey(),
  tags: text('tags').notNull(),
});

export const tagsTable = sqliteTable(
  'tags',
  {
    tag: text('tag').notNull(),
    sub: integer('sub').notNull(),
    tokens: text('tokens').notNull(),
    count: integer('count').notNull(),
    tail: integer('tail').notNull(),
  },
  (table) => {
    return [primaryKey({ columns: [table.tag, table.sub] })];
  },
);
