import { createWorkerEntrypointLocal } from '@announcing/cloudflare-support/local';
import { FCM, FcmOptions, type FcmServiceAccount } from 'fcm-cloudflare-workers';
import { expect, test, vi } from 'vitest';
import { SendNotificationEntrypoint } from '../src';
import { createTestDB } from './testDB';

test('sendNotification', async () => {
  const { d1, kv } = await createTestDB();
  const entrypoint = createWorkerEntrypointLocal(SendNotificationEntrypoint, {
    D1_NOTIFICATION: d1,
    KV_NOTIFICATION: kv,
    GOOGLE_CREDENTIALS_BASE64: Buffer.from('{}').toString('base64'),
  });

  await entrypoint.sendNotification({ tag: 'test', message: {} });
});

test('FCM behavior', async () => {
  const fcm = new FCM(
    new FcmOptions({
      serviceAccount: { project_id: 'test' } as FcmServiceAccount,
    }),
  );

  const getAccessTokenMock = vi.fn().mockResolvedValue('mocked_token');
  const processBatchMock = vi.fn().mockResolvedValue([]);

  Reflect.set(fcm, 'getAccessToken', getAccessTokenMock);
  Reflect.set(fcm, 'processBatch', processBatchMock);

  await fcm.sendToTokens(
    {},
    Array.from({ length: 500 }, (_, i) => (i + 1).toString()),
  );

  expect(processBatchMock).toBeCalledTimes(5);
});
