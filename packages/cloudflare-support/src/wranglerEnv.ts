import { configDotenv } from 'dotenv';

type Env = {
  WRITER_PROJECT_NAME: string;
  READER_PROJECT_NAME: string;
  NOTIFICATION_PROJECT_NAME: string;
  HELP_PROJECT_NAME: string;
  D1_ID: string;
  D1_NOTIFICATION_ID: string;
  R2_BUCKET_NAME: string;
  R2_POST_LOG_BUCKET_NAME: string;
  KV_NOTIFICATION_ID: string;
  EMAIL_ADDRESS: string;
};

export const getWranglerLocalEnv = (): Env => {
  return {
    WRITER_PROJECT_NAME: 'announcing-writer-local',
    READER_PROJECT_NAME: 'announcing-reader-local',
    NOTIFICATION_PROJECT_NAME: 'announcing-notification-local',
    HELP_PROJECT_NAME: 'announcing-help-local',
    D1_ID: 'd1-local',
    D1_NOTIFICATION_ID: 'd1-notification-local',
    R2_BUCKET_NAME: 'r2-local',
    R2_POST_LOG_BUCKET_NAME: 'r2-post-log-local',
    KV_NOTIFICATION_ID: 'kv-notification-local',
    EMAIL_ADDRESS: 'info@local',
  };
};

export const getWranglerRemoteEnv = (): Env => {
  configDotenv({ path: '../cloudflare-support/.wrangler.env.remote' });

  const getValue = (key: string) => {
    return process.env[key] ?? '';
  };

  return {
    WRITER_PROJECT_NAME: getValue('WRITER_PROJECT_NAME'),
    READER_PROJECT_NAME: getValue('READER_PROJECT_NAME'),
    NOTIFICATION_PROJECT_NAME: getValue('NOTIFICATION_PROJECT_NAME'),
    HELP_PROJECT_NAME: getValue('HELP_PROJECT_NAME'),
    D1_ID: getValue('D1_ID'),
    D1_NOTIFICATION_ID: getValue('D1_NOTIFICATION_ID'),
    R2_BUCKET_NAME: getValue('R2_BUCKET_NAME'),
    R2_POST_LOG_BUCKET_NAME: getValue('R2_POST_LOG_BUCKET_NAME'),
    KV_NOTIFICATION_ID: getValue('KV_NOTIFICATION_ID'),
    EMAIL_ADDRESS: getValue('EMAIL_ADDRESS'),
  };
};
