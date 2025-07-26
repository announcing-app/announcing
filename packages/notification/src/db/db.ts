import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { deleteTokens } from './tokens/deleteTokens';
import { putToken } from './tokens/putToken';
import { readTokens } from './tokens/readTokens';

export type CFBindings = {
  D1_NOTIFICATION: D1Database;
};

const MAX_TOKENS = 50000;

export type DBContext = {
  db: DrizzleD1Database;
  maxTokens: number;
};

export const createDB = ({
  D1_NOTIFICATION,
  maxTokens,
}: {
  D1_NOTIFICATION: D1Database;
  maxTokens?: number | undefined;
}) => {
  const ctx: DBContext = {
    db: drizzle(D1_NOTIFICATION),
    maxTokens: maxTokens ?? MAX_TOKENS,
  };

  return {
    putToken: (params: Parameters<typeof putToken>[1]) => {
      return putToken(ctx, params);
    },
    deleteTokens: (params: Parameters<typeof deleteTokens>[1]) => {
      return deleteTokens(ctx, params);
    },
    readTokens: (params: Parameters<typeof readTokens>[1]) => {
      return readTokens(ctx, params);
    },
  };
};
