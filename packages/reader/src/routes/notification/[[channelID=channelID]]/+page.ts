import { browser } from '$app/environment';
import { fetchChannel } from '$lib/fetch/fetchChannel';
import { getNotificationChannels } from '$lib/notification/localStorage';
import type { GetChannelResult } from '@announcing/db/types';
import { redirect } from '@sveltejs/kit';
import { isSupported } from 'firebase/messaging';
import type { PageLoad } from './$types';

type Channel =
  | (GetChannelResult & { status: boolean })
  | { channelID: string; name: string; status: 'deleted' };

type NotificationStatus =
  | {
      supported: false;
      channel?: GetChannelResult;
    }
  | {
      supported: true;
      channels: Channel[];
    };

const loadNotificationStatus = async (
  fetch_: typeof fetch,
  focusChannelID: string | undefined,
): Promise<NotificationStatus> => {
  if (!browser || !(await isSupported())) {
    if (focusChannelID) {
      const channel = await fetchChannel(focusChannelID, fetch_);
      if (!channel) {
        redirect(303, '/notification');
      }
      return {
        supported: false,
        channel,
      };
    }

    return { supported: false };
  }

  const notificationChannels = getNotificationChannels();

  const channels: Channel[] = await Promise.all(
    Object.entries(notificationChannels).map(async ([channelID, { name }]) => {
      const channel = await fetchChannel(channelID, fetch_);
      if (channel) {
        return { ...channel, status: true };
      } else {
        return { channelID, name, status: 'deleted' } as const;
      }
    }),
  );

  if (focusChannelID) {
    if (!(focusChannelID in notificationChannels)) {
      const channel = await fetchChannel(focusChannelID, fetch_);
      if (channel) {
        channels.push({ ...channel, status: false });
      }
    }
  }

  const compareValue = (v: (typeof channels)[number]) => {
    if (v.channelID === focusChannelID) {
      return -1;
    }
    if (v.status === 'deleted') {
      return Number.MAX_SAFE_INTEGER;
    }
    return v.updatedAt;
  };

  channels.sort((a, b) => {
    return compareValue(a) - compareValue(b);
  });

  return {
    supported: true,
    channels,
  };
};

export const load: PageLoad = async ({ params, fetch }) => {
  const channelID = params.channelID;

  const notificationStatus = await loadNotificationStatus(fetch, channelID);

  return {
    notificationStatus,
    channelID,
  };
};
