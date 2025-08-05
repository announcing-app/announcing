import { postNotification } from '$lib/fetch/postNotification';
import { getNotificationToken } from '$lib/notification/firebase';
import type { GetChannelResult } from '@announcing/db/types';
import { isSupported } from 'firebase/messaging';
import * as v from 'valibot';

const STORAGE_KEY = 'favorites';

const favoritesSchema = v.array(
  v.strictObject({
    channelID: v.pipe(v.string(), v.nonEmpty()),
    name: v.pipe(v.string(), v.nonEmpty()),
    icon: v.optional(v.pipe(v.string(), v.nonEmpty())),
    notification: v.optional(v.boolean()),
    lastReadID: v.optional(v.pipe(v.string())),
  }),
);

export type Favorites = v.InferInput<typeof favoritesSchema>;
export type Favorite = Favorites[number];

const toMap = (favorites: Favorites) => {
  return new Map(favorites.map((v) => [v.channelID, v]));
};

export const getFavorites = (): Favorites => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');

    if (v.is(favoritesSchema, data)) {
      return data;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

export const addFavorite = (channel: GetChannelResult) => {
  const favoritesMap = toMap(getFavorites());
  const current = favoritesMap.get(channel.channelID);
  favoritesMap.set(channel.channelID, {
    channelID: channel.channelID,
    name: channel.name,
    ...(channel.icon && { icon: channel.icon }),
    ...(current?.notification && { notification: current.notification }),
    lastReadID: channel.announcementIDs?.[0] ?? '',
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favoritesMap.values()]));
};

export const updateFavorites = (favorites: Favorites) => {
  const striped: Favorites = favorites.map((v) => {
    return {
      channelID: v.channelID,
      name: v.name,
      ...(v.icon && { icon: v.icon }),
      ...(v.notification && { notification: v.notification }),
    };
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(striped));
};

export const updateLastReadID = (channelID: string, lastReadID: string) => {
  const favorites = getFavorites();
  const favoritesMap = toMap(favorites);
  const favorite = favoritesMap.get(channelID);
  if (!favorite) {
    return;
  }
  favorite.lastReadID = lastReadID;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favoritesMap.values()]));
};

export const deleteFavorite = async (channelID: string) => {
  const favorites = getFavorites();
  const favoritesMap = toMap(favorites);

  const favorite = favoritesMap.get(channelID);
  if (favorite && favorite.notification) {
    const supported = await isSupported();
    if (supported && Notification.permission === 'granted') {
      const token = await getNotificationToken();
      const tags = favorites.map((v) => v.channelID).filter((v) => v !== channelID);
      await postNotification({ token, tags });
    }
  }

  favoritesMap.delete(channelID);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favoritesMap.values()]));
};
