import { drizzle } from 'drizzle-orm/d1';
import { migrate } from 'drizzle-orm/d1/migrator';
import { Miniflare } from 'miniflare';
import { createDB } from '../src/db/db';

const MIGRATIONS_DIR = './migrations';

export const createTestDB = async (maxTokens?: number) => {
  const path = 'memory:';

  const mf = new Miniflare({
    modules: true,
    script: '',
    d1Databases: ['D1_NOTIFICATION'],
    d1Persist: `${path}/d1`,
    kvNamespaces: ['KV_NOTIFICATION'],
    kvPersist: `${path}/kv`,
  });

  const bindings = await mf.getBindings<{
    D1_NOTIFICATION: D1Database;
    KV_NOTIFICATION: KVNamespace;
  }>();

  const d1 = bindings.D1_NOTIFICATION;

  {
    const db = drizzle(d1);
    await migrate(db, { migrationsFolder: MIGRATIONS_DIR });
  }

  return { db: createDB({ ...bindings, maxTokens }), d1, kv: bindings.KV_NOTIFICATION };
};
