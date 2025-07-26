import { dev } from '$app/environment';
import { PUBLIC_READER_SENTRY_DSN } from '$env/static/public';
import { createDB } from '@announcing/db';
import {
  handleErrorWithSentry,
  initCloudflareSentryHandle,
  sentryHandle,
  init as sentryInit,
} from '@sentry/sveltekit';
import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

let localBindings: App.Platform['env'];

if (dev) {
  localBindings = await (await import('$lib/local/localBinding')).createLocalBindings();
}

const cloudflareHandle: Handle = ({ resolve, event }) => {
  if (dev) {
    event.locals = {
      ...event.locals,
      db: createDB(localBindings),
      putToken: async (params) => {
        await localBindings.WK_PUT_TOKEN.putToken(params);
      },
    };
  } else {
    const env = event.platform?.env;
    if (!env) {
      throw new Error('Missing platform.env');
    }
    event.locals = {
      ...event.locals,
      db: createDB(env),
      putToken: async (params) => {
        await env.WK_PUT_TOKEN.putToken(params);
      },
    };
  }
  return resolve(event);
};

const handlers = [];
if (PUBLIC_READER_SENTRY_DSN) {
  if (!dev) {
    handlers.push(
      initCloudflareSentryHandle({
        dsn: PUBLIC_READER_SENTRY_DSN,
        tracesSampleRate: 1.0,
      }),
    );
  } else {
    sentryInit({
      dsn: PUBLIC_READER_SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  }
  handlers.push(sentryHandle());
}
handlers.push(cloudflareHandle);

export const handle = sequence(...handlers);

export const handleError = handleErrorWithSentry();
