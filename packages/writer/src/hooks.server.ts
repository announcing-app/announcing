import { dev } from '$app/environment';
import { PERFORMANCE_HOOK } from '$env/static/private';
import { PUBLIC_WRITER_SENTRY_DSN } from '$env/static/public';
import { createDB } from '@announcing/db';
import {
  handleErrorWithSentry,
  initCloudflareSentryHandle,
  sentryHandle,
  init as sentryInit,
} from '@sentry/sveltekit';
import { error, type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authenticationHandle } from './auth';

const performanceHandle: Handle = async ({ event, resolve }) => {
  const start = performance.now();

  const response = await resolve(event);

  const end = performance.now();
  const duration = end - start;

  console.log(`[PERF] ${event.request.method} ${event.url.pathname} - ${duration.toFixed(2)} ms`);

  return response;
};

let localBindings: App.Platform['env'];

if (dev) {
  localBindings = await (await import('$lib/local/localBinding')).createLocalBindings();
}

const authorizationHandle: Handle = async ({ resolve, event }) => {
  if (!event.url.pathname.startsWith('/signin')) {
    const session = await event.locals.auth();

    if (!session?.user?.id) {
      if (event.url.pathname.startsWith('/api')) {
        error(400);
      } else {
        redirect(303, '/signin');
      }
    }
  }

  return resolve(event);
};

const cloudflareHandle: Handle = ({ resolve, event }) => {
  if (dev) {
    event.locals = {
      ...event.locals,
      db: createDB(localBindings),
      storePostLog: async (params) => {
        await localBindings.WF_STORE_POST_LOG.create({ params });
      },
      sendNotification: async (params) => {
        await localBindings.SEND_NOTIFICATION.sendNotification(params);
      },
      waitUntil: () => {
        //
      },
    };
  } else {
    const env = event.platform?.env;
    if (!env) {
      throw new Error('Missing platform.env');
    }
    const context = event.platform?.context;
    if (!context) {
      throw new Error('Missing platform.context');
    }

    event.locals = {
      ...event.locals,
      db: createDB(env),
      storePostLog: async (params) => {
        await env.WF_STORE_POST_LOG.create({ params });
      },
      sendNotification: async (params) => {
        await env.SEND_NOTIFICATION.sendNotification(params);
      },
      waitUntil: (promise: Promise<unknown>) => {
        context.waitUntil(promise);
      },
    };
  }
  return resolve(event);
};

const handlers = [];
if (PERFORMANCE_HOOK) {
  handlers.push(performanceHandle);
}
if (PUBLIC_WRITER_SENTRY_DSN) {
  if (!dev) {
    handlers.push(
      initCloudflareSentryHandle({
        dsn: PUBLIC_WRITER_SENTRY_DSN,
        tracesSampleRate: 1.0,
      }),
    );
  } else {
    sentryInit({
      dsn: PUBLIC_WRITER_SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  }
  handlers.push(sentryHandle());
}
handlers.push(authenticationHandle, authorizationHandle, cloudflareHandle);

export const handle = sequence(...handlers);

export const handleError = handleErrorWithSentry();
