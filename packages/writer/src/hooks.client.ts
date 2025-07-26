import { PUBLIC_WRITER_SENTRY_DSN } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';
import { handleErrorWithSentry } from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit';

if (PUBLIC_WRITER_SENTRY_DSN) {
  Sentry.init({
    dsn: PUBLIC_WRITER_SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

const errorHandler: HandleClientError = (input) => {
  console.error('Unhandled error: ', input);
};

export const handleError = handleErrorWithSentry(errorHandler);
