import { defineConfig } from 'drizzle-kit';

// https://orm.drizzle.team/docs/guides/d1-http-with-drizzle-kit
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
});
