// https://svelte.dev/docs/kit/service-workers
// https://github.com/microsoft/TypeScript/issues/11781

/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

import { PUBLIC_LOG, PUBLIC_READER_SENTRY_DSN } from '$env/static/public';
import { isIOS } from '$lib/platform/platform';
import { build, files, version } from '$service-worker';
import * as Sentry from '@sentry/browser';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (self as any).__WB_DISABLE_DEV_LOGS = true;
}

if (PUBLIC_READER_SENTRY_DSN) {
  Sentry.init({
    dsn: PUBLIC_READER_SENTRY_DSN,
    _experiments: {
      enableLogs: true,
    },
  });
}

const log: (data: unknown) => Promise<void> = (() => {
  if (PUBLIC_LOG) {
    return async (data: unknown) => {
      await sw.fetch(`/api/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ua: `SW: ${sw.navigator.userAgent}`, log: data }),
      });
    };
  }
  return () => {
    return Promise.resolve();
  };
})();

{
  const precacheAssets = [...build, ...files].map((url) => {
    return { url, revision: version };
  });

  precacheAndRoute(precacheAssets);
  cleanupOutdatedCaches();
}

{
  const cacheFirstStrategy = new CacheFirst();
  const networkFirstStrategy = new NetworkFirst();

  const createRegexMatcher = (regex: RegExp) => {
    return ({ url }: { url: URL }) => {
      return regex.test(url.pathname);
    };
  };

  // CacheFirst: /api/channels/{channelID}/announcements/{announcementID}
  registerRoute(
    createRegexMatcher(/^\/api\/channels\/[^/]+\/announcements\/[^/]+$/),
    cacheFirstStrategy,
  );

  // CacheFirst: /s/{objectKey}
  registerRoute(createRegexMatcher(/^\/s\/[^/]+$/), cacheFirstStrategy);

  // NetworkFirst: /api/channels/{channelID}
  registerRoute(createRegexMatcher(/^\/api\/channels\/[^/]+$/), networkFirstStrategy);
}

sw.addEventListener('install', (event) => {
  event.waitUntil(sw.skipWaiting());
});
sw.addEventListener('activate', (event) => {
  event.waitUntil(sw.clients.claim());
});

const wrapPromise = async (label: string, p: Promise<unknown>) => {
  try {
    await p;
  } catch (error) {
    const data = {
      'SW Unhandled Error': label,
      error,
      ...(error instanceof Error && { message: error.message }),
    };
    if (PUBLIC_READER_SENTRY_DSN) {
      Sentry.logger.error(JSON.stringify(data));
    }
    await log(data);
  }
};

const getClient = async () => {
  const clients = await sw.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of clients) {
    try {
      await client.focus();
      return client;
    } catch (err) {
      await log({ 'focus error': err instanceof Error ? err.message : new String(err) });
    }
  }
  return;
};

const waitForClient = async () => {
  for (let i = 0; i < 8; i++) {
    const client = await getClient();
    if (client) {
      return client;
    }

    await log('no client');

    await new Promise<void>((resolve) => {
      sw.setTimeout(() => {
        resolve();
      }, 250);
    });
  }

  await log('create client');
  return await sw.clients.openWindow('/notification');
};

const onPush = async (event: PushEvent) => {
  await log('push event');

  if (!event.data) {
    return;
  }
  const payload = event.data.json();

  await log({ payload });

  const notification = payload.notification;

  await sw.registration.showNotification(notification.title, notification);
};

const onNotificationClick = async (event: NotificationEvent) => {
  await log('notificationclick event');
  event.notification.close();

  const notification = event.notification;

  const channelID = notification.tag;
  if (!channelID) {
    await log('no channelID');
    return;
  }

  const link = `/${channelID}`;

  if (!isIOS()) {
    await sw.clients.openWindow(link);
    return;
  }

  const client = await waitForClient();
  if (!client) {
    await log('no client');
    return;
  }

  const openLink = `x-safari-https://${location.host}${link}`;

  await client.navigate(openLink);
};

sw.addEventListener('push', (event) => {
  event.waitUntil(wrapPromise('onPush', onPush(event)));
});

sw.addEventListener('notificationclick', (event) => {
  event.waitUntil(wrapPromise('onNotificationClick', onNotificationClick(event)));
});
