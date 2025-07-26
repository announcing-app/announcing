/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchChannel } from '$lib/fetch/fetchChannel';
import { getNotificationChannels } from '$lib/notification/localStorage';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { load } from '../../../src/routes/notification/[[channelID=channelID]]/+page';

vi.mock('$app/environment', () => ({
  browser: true,
}));

vi.mock('firebase/messaging', () => ({
  isSupported: () => true,
}));

vi.mock('$lib/fetch/fetchChannel', () => ({
  fetchChannel: vi.fn(),
}));

vi.mock('$lib/notification/localStorage', () => ({
  getNotificationChannels: vi.fn(),
}));

describe('load function', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should sort channels as expected', async () => {
    const notificationChannels = {
      c1: { name: 'Channel 1' },
      c3: { name: 'Channel 3' },
    };

    (getNotificationChannels as Mock).mockReturnValue(notificationChannels);

    (fetchChannel as Mock).mockImplementation((channelID: string) => {
      const data: Record<string, unknown> = {
        c1: { channelID: 'c1', name: 'Channel 1', updatedAt: 100 },
        c2: { channelID: 'c2', name: 'Channel 2', updatedAt: 200 },
        c3: { channelID: 'c3', name: 'Channel 3', updatedAt: 50 },
      };
      return data[channelID] ?? null;
    });

    const params = { channelID: 'c2' };

    const result: any = await load({ params } as any);

    expect(result.notificationStatus.channels).toEqual([
      {
        channelID: 'c2',
        name: 'Channel 2',
        updatedAt: 200,
        status: false,
      },
      {
        channelID: 'c3',
        name: 'Channel 3',
        updatedAt: 50,
        status: true,
      },
      {
        channelID: 'c1',
        name: 'Channel 1',
        updatedAt: 100,
        status: true,
      },
    ]);
  });

  it('should put deleted channels last', async () => {
    const notificationChannels = {
      c1: { name: 'Channel 1' },
      c2: { name: 'Channel 2' },
    };
    (getNotificationChannels as Mock).mockReturnValue(notificationChannels);

    (fetchChannel as Mock).mockImplementation((channelID: string) => {
      if (channelID === 'c1') {
        return { channelID: 'c1', name: 'Channel 1', updatedAt: 100 };
      }
      return null;
    });

    const params = { channelID: 'cX' };

    const result: any = await load({ params } as any);

    expect(result.notificationStatus.channels).toEqual([
      {
        channelID: 'c1',
        name: 'Channel 1',
        updatedAt: 100,
        status: true,
      },
      {
        channelID: 'c2',
        name: 'Channel 2',
        status: 'deleted',
      },
    ]);
  });
});
