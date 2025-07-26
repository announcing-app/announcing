import { drizzle } from 'drizzle-orm/d1';
import { migrate } from 'drizzle-orm/d1/migrator';
import { Miniflare } from 'miniflare';
import { createDB } from '../src';

const MIGRATIONS_DIR = '../db/migrations';

export const createTestDB = async () => {
  const path = 'memory:';

  const mf = new Miniflare({
    modules: true,
    script: '',
    d1Databases: ['D1'],
    d1Persist: `${path}/d1`,
    r2Buckets: ['R2'],
    r2Persist: `${path}/r2`,
  });

  const bindings = await mf.getBindings<{ D1: D1Database; R2: R2Bucket }>();

  {
    const db = drizzle(bindings.D1);
    await migrate(db, { migrationsFolder: MIGRATIONS_DIR });
  }

  return createDB(bindings);
};
