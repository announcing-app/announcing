import { and, eq } from 'drizzle-orm';
import type { DBContext } from '../db';
import { tagsTable } from '../schema';

const CHUNK_SIZE = 500;

type Params = {
  tag: string;
  callback: (tokens: string[]) => void | Promise<void>;
  chunkSize?: number;
};

export const readTokens = async ({ db }: DBContext, params: Params) => {
  const { tag, callback } = params;
  const chunkSize = params.chunkSize ?? CHUNK_SIZE;
  let sub = 1;
  const stack: string[] = [];

  for (;;) {
    const tagRec = (
      await db
        .select({ tokens: tagsTable.tokens, tail: tagsTable.tail })
        .from(tagsTable)
        .where(and(eq(tagsTable.tag, tag), eq(tagsTable.sub, sub)))
    ).shift();

    if (!tagRec) {
      break;
    }

    const tokens = tagRec.tokens
      .trim()
      .split(' ')
      .filter((v) => !!v.trim());
    stack.push(...tokens);

    while (stack.length > chunkSize) {
      const tokens = stack.splice(0, chunkSize);
      await callback(tokens);
    }

    if (tagRec.tail) {
      break;
    }

    sub++;
  }

  while (stack.length > 0) {
    const tokens = stack.splice(0, chunkSize);
    await callback(tokens);
  }
};
