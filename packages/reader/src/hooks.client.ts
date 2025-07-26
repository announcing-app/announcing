import { PUBLIC_READER_SENTRY_DSN } from '$env/static/public';
import { handleErrorWithSentry, init as sentryInit } from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit';

if (PUBLIC_READER_SENTRY_DSN) {
  sentryInit({
    dsn: PUBLIC_READER_SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

const errorHandler: HandleClientError = (input) => {
  console.error('Unhandled error: ', input);
};

export const handleError = handleErrorWithSentry(errorHandler);
