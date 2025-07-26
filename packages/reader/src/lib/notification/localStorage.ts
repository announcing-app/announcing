const LOCAL_STORAGE_KEY = 'notification-channels';
export type NotificationLocalStorageValue = Record<string, { name: string }>;

export const saveNotificationChannels = (v: NotificationLocalStorageValue) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(v));
};

export const getNotificationChannels = (): NotificationLocalStorageValue => {
  const s = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!s) {
    return {};
  } else {
    try {
      return JSON.parse(s);
    } catch {
      return {};
    }
  }
};
