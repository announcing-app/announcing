import { WorkerEntrypoint } from 'cloudflare:workers';
import { createDB } from '../db/db';

export type PutTokenParams = { token: string; tags: string[] };

export class PutTokenEntrypoint extends WorkerEntrypoint<{
  D1_NOTIFICATION: D1Database;
}> {
  async putToken(params: PutTokenParams) {
    const db = createDB(this.env);
    await db.putToken(params);
  }
}
