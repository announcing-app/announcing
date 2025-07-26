import { assert, describe, expect, test } from 'vitest';

import { openAsBlob } from 'fs';
import { createTestDB } from './testDB';

describe('Channel', () => {
  test('create, update and delete', async () => {
    const db = await createTestDB();

    await db.createChannel({
      userID: 'u1',
      channelID: '1',
      name: 'test channel',
      desc: 'This is test',
      icon: await openAsBlob('tests/board-361516_1280.jpg', { type: 'image/jpeg' }),
    });
    expect(await db.getChannel({ userID: 'u2', channelID: '1' })).toBeUndefined();

    {
      const c = await db.getChannel({ userID: 'u1', channelID: '1' });

      assert(c);

      expect(c).toMatchObject({
        channelID: '1',
        name: 'test channel',
        desc: 'This is test',
      });

      await db.updateChannel({
        userID: 'u2',
        updatedAt: c.updatedAt,
        channelID: '1',
        name: 'should not update',
        desc: c.desc,
        icon: c.icon,
      });
      expect(await db.getChannel({ userID: 'u1', channelID: '1' })).toMatchObject({
        channelID: '1',
        name: 'test channel',
        desc: 'This is test',
      });

      await db.updateChannel({
        userID: 'u1',
        updatedAt: c.updatedAt,
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });
    }
    {
      const c = await db.getChannel({ userID: 'u1', channelID: '1' });

      assert(c);

      expect(c).toMatchObject({
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });

      await db.deleteChannel({ userID: 'u2', channelID: '1', updatedAt: c.updatedAt });
      expect(await db.getChannel({ userID: 'u1', channelID: '1' })).toMatchObject({
        channelID: '1',
        name: 'update channel',
        desc: 'updated',
        icon: undefined,
      });

      await db.deleteChannel({ userID: 'u1', channelID: '1', updatedAt: c.updatedAt });
      expect(await db.getChannel({ userID: 'u1', channelID: '1' })).toBeUndefined();
    }
  });

  test('Too many channels', async () => {
    const db = await createTestDB();

    for (let i = 1; i <= 6; i++) {
      await db.createChannel({
        userID: 'u1',
        channelID: i.toString(),
        name: `channel${i}`,
        desc: undefined,
        icon: undefined,
      });
    }

    const channels = await db.getChannels({ userID: 'u1' });
    expect(channels.length).toEqual(5);
  });

  test('empty name', async () => {
    const db = await createTestDB();

    await expect(
      db.createChannel({
        userID: '1',
        channelID: '1',
        name: '',
        desc: undefined,
        icon: undefined,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  test('check channel left', async () => {
    const db = await createTestDB();

    const c = await db.getChannel({ userID: 'u1', channelID: '1' });
    expect(c).toBeUndefined();
  });
});
