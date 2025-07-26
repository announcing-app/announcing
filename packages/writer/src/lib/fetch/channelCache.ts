import { invalidateAll } from '$app/navigation';
import type { GetChannelResult } from '@announcing/db/types';

let channels: GetChannelResult[] | undefined;
let channelMap: Map<string, GetChannelResult> | undefined;

export const getChannelsCache = () => {
  return channels;
};

export const setChannelsCache = (v: GetChannelResult[]) => {
  channels = v;
  channelMap = new Map(
    v.map((v) => {
      return [v.channelID, v];
    }),
  );
};

export const getChannelCache = (channelID: string) => {
  return channelMap?.get(channelID);
};

export const setChannelCache = (v: GetChannelResult) => {
  if (!channelMap) {
    channelMap = new Map();
  }
  channelMap.set(v.channelID, v);
};

export const clearChannelCache = async () => {
  channels = undefined;
  channelMap = undefined;
  await invalidateAll();
};
