Register the following JSON in an environment variable named VALUES_JSON.

```json
{
  "WRITER_PROJECT_NAME": "announcing-writer",
  "READER_PROJECT_NAME": "announcing-reader",
  "NOTIFICATION_PROJECT_NAME": "announcing-notification",
  "D1_ID": "xxx-xxx-xxx-xxx",
  "D1_NOTIFICATION_ID": "xxx-xxx-xxx-xxx",
  "R2_BUCKET_NAME": "announcing",
  "R2_POST_LOG_BUCKET_NAME": "announcing-post-log",
  "KV_NOTIFICATION_ID": "xxxxxxxxxxx",
  "PUBLIC_FIREBASE_CONFIG_JSON": {
    "apiKey": "xxxx",
    "projectId": "xxx",
    "messagingSenderId": "1234567890",
    "appId": "1:1234:web:xxx"
  },
  "PUBLIC_FIREBASE_VAPID_KEY": "xxxx",
  "PUBLIC_READER_SENTRY_DSN": "https://xxx@xxx.ingest.us.sentry.io/xxx",
  "PUBLIC_READER_ERROR_TEST": 1,
  "PUBLIC_READER_PREFIX": "https://announcing-reader.suzulabo.workers.dev",
  "PUBLIC_WRITER_SENTRY_DSN": "https://xxx@xxx.ingest.us.sentry.io/xxx",
  "PERFORMANCE_HOOK": null,
  "PUBLIC_AUTH_CARDINALS": 1,
  "PUBLIC_WRITER_ERROR_TEST": 1
}
```
