import { and, eq, sql } from 'drizzle-orm';
import { type DBContext } from '../db';
import { tagsTable, tokensTable } from '../schema';
import { isTuple, parseTagSub, type TagSub } from './shared';

export const putToken = async (
  { db, maxTokens }: DBContext,
  { token, tags }: { token: string; tags: string[] },
) => {
  const curToken = (
    await db.select().from(tokensTable).where(eq(tokensTable.token, token))
  ).shift();

  const curTags = curToken?.tags;

  const curTagSubs: TagSub[] = curTags ? curTags.trim().split(' ').map(parseTagSub) : [];
  const tagsAdded: string[] = [];
  const tagSubsRemoved: TagSub[] = [];

  const newTagSubs: TagSub[] = [];

  if (!curToken) {
    tagsAdded.push(...tags);
  } else {
    tagsAdded.push(
      ...tags.filter((tag) => {
        return !curTagSubs.some((v) => {
          return v.tag === tag;
        });
      }),
    );

    for (const v of curTagSubs) {
      if (tags.includes(v.tag)) {
        newTagSubs.push(v);
      } else {
        tagSubsRemoved.push(v);
      }
    }
  }

  const batchQueries = [];

  if (tagsAdded.length > 0) {
    const queries = tagsAdded.map((tag) => {
      return db
        .select({ sub: tagsTable.sub, count: tagsTable.count, tail: tagsTable.tail })
        .from(tagsTable)
        .where(and(eq(tagsTable.tag, tag), eq(tagsTable.tail, 1)));
    });

    const curTagRecs = isTuple(queries) ? await db.batch(queries) : [];

    tagsAdded.forEach((tag, i) => {
      const curTag = curTagRecs[i]?.shift();
      let sub = 1;
      if (curTag) {
        if (curTag.count >= maxTokens) {
          sub = curTag.sub + 1;
          batchQueries.push(
            db
              .update(tagsTable)
              .set({
                tail: 0,
              })
              .where(and(eq(tagsTable.tag, tag), eq(tagsTable.sub, curTag.sub))),
          );
        } else {
          sub = curTag.sub;
        }
      }

      batchQueries.push(
        db
          .insert(tagsTable)
          .values({
            tag,
            sub,
            tokens: `${token} `,
            count: 1,
            tail: 1,
          })
          .onConflictDoUpdate({
            target: [tagsTable.tag, tagsTable.sub],
            set: {
              tokens: sql`${tagsTable.tokens} || ${token} || " "`,
              count: sql`${tagsTable.count} + 1`,
            },
          }),
      );

      newTagSubs.push({
        tag,
        sub,
      });
    });
  }

  for (const v of tagSubsRemoved) {
    batchQueries.push(
      db
        .update(tagsTable)
        .set({
          tokens: sql`REPLACE(${tagsTable.tokens}, ${token} || ' ', '')`,
          count: sql`${tagsTable.count} - 1`,
        })
        .where(
          and(
            eq(tagsTable.tag, v.tag),
            eq(tagsTable.sub, v.sub),
            sql`INSTR(${tagsTable.tokens}, ${token}) >= 0`,
          ),
        ),
    );
  }

  if (newTagSubs.length === 0) {
    batchQueries.push(db.delete(tokensTable).where(eq(tokensTable.token, token)));
  } else {
    const tags = newTagSubs.map((v) => `${v.tag}:${v.sub}`).join(' ');

    batchQueries.push(
      db
        .insert(tokensTable)
        .values({
          token,
          tags,
        })
        .onConflictDoUpdate({
          target: tokensTable.token,
          set: {
            tags,
          },
        }),
    );
  }

  if (isTuple(batchQueries)) {
    await db.batch(batchQueries);
  }
};
