import { and, eq, inArray, sql } from 'drizzle-orm';
import type { BatchItem } from 'drizzle-orm/batch';
import type { DBContext } from '../db';
import { tagsTable, tokensTable } from '../schema';
import { isTuple, parseTagSub } from './shared';

const TOKEN_CHUNK_SIZE = 10;
const BATCH_LIMIT = 50;

export const deleteTokens = async ({ db }: DBContext, { tokens }: { tokens: string[] }) => {
  let batchQueries: BatchItem<'sqlite'>[] = [];

  while (tokens.length > 0) {
    const chunk = tokens.splice(0, TOKEN_CHUNK_SIZE);

    const tokenRecs = await db.select().from(tokensTable).where(inArray(tokensTable.token, chunk));

    for (const rec of tokenRecs) {
      const { token, tags } = rec;

      const tagSubs = tags.split(' ').map(parseTagSub);

      // If the number of statements exceeds the limit, the batch is executed.
      if (isTuple(batchQueries, BATCH_LIMIT - tagSubs.length)) {
        await db.batch(batchQueries);
        batchQueries = [];
      }

      for (const { tag, sub } of tagSubs) {
        batchQueries.push(
          db
            .update(tagsTable)
            .set({
              tokens: sql`REPLACE(${tagsTable.tokens}, ${token} || ' ', '')`,
              count: sql`${tagsTable.count} - 1`,
            })
            .where(
              and(
                eq(tagsTable.tag, tag),
                eq(tagsTable.sub, sub),
                sql`INSTR(${tagsTable.tokens}, ${token}) >= 0`,
              ),
            ),
        );
      }

      batchQueries.push(db.delete(tokensTable).where(eq(tokensTable.token, token)));
    }
  }

  if (isTuple(batchQueries)) {
    await db.batch(batchQueries);
  }
};
