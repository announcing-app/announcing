import { GOOGLE_CREDENTIALS_BASE64 } from '$env/static/private';
import {
  createWorkerEntrypointLocal,
  createWorkflowLocal,
} from '@announcing/cloudflare-support/local';
import { createLocalPlatform } from '@announcing/cloudflare-support/localPlatform';
import { SendNotificationEntrypoint } from '@announcing/notification';
import { StorePostLogWorkflowEntrypoint } from '../../workers/storePostLogWorkflow';

export const localPlatform = await (async () => {
  const platform = await createLocalPlatform();

  const WF_STORE_POST_LOG = createWorkflowLocal(StorePostLogWorkflowEntrypoint, platform.env);

  const SEND_NOTIFICATION = ((): SendNotificationEntrypoint => {
    if (!GOOGLE_CREDENTIALS_BASE64) {
      return {
        sendNotification: () => {
          return Promise.resolve({ id: '' });
        },
      } as unknown as SendNotificationEntrypoint;
    }

    return createWorkerEntrypointLocal(SendNotificationEntrypoint, {
      ...platform.env,
      GOOGLE_CREDENTIALS_BASE64,
    });
  })();

  const env = { ...platform.env, WF_STORE_POST_LOG, SEND_NOTIFICATION };

  return {
    ...platform,
    env,
  };
})();
