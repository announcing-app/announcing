import type { KVNamespace as KVNamespace_ } from '@cloudflare/workers-types';
import { WorkerEntrypoint } from 'cloudflare:workers';
import { FCM, FcmOptions, type EnhancedFcmMessage } from 'fcm-cloudflare-workers';
import { createDB } from '../db/db';

export type SendNotificationParams = {
  tag: string;
  message: EnhancedFcmMessage;
};

export class SendNotificationEntrypoint extends WorkerEntrypoint<{
  D1_NOTIFICATION: D1Database;
  KV_NOTIFICATION: KVNamespace;
  GOOGLE_CREDENTIALS_BASE64: string;
}> {
  async sendNotification({ tag, message }: SendNotificationParams) {
    const db = createDB(this.env);
    const fcmOptions = new FcmOptions({
      serviceAccount: JSON.parse(
        Buffer.from(this.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf8'),
      ),
      kvStore: this.env.KV_NOTIFICATION as KVNamespace_,
      kvCacheKey: 'fcm_access_token',
    });

    const fcm = new FCM(fcmOptions);

    const invalidTokens: string[] = [];

    await db.readTokens({
      tag,
      callback: async (tokens) => {
        invalidTokens.push(...(await fcm.sendToTokens(message, tokens)));
      },
    });

    if (invalidTokens.length > 0) {
      await db.deleteTokens({ tokens: invalidTokens });
    }
  }
}
