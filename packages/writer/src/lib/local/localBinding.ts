import { GOOGLE_CREDENTIALS_BASE64 } from '$env/static/private';
import {
  createWorkerEntrypointLocal,
  createWorkflowLocal,
} from '@announcing/cloudflare-support/local';
import { createLocalBindings as createLocalBindings_ } from '@announcing/cloudflare-support/localBindings';
import { SendNotificationEntrypoint } from '@announcing/notification';
import { StorePostLogWorkflowEntrypoint } from '../../workers/storePostLogWorkflow';

export const createLocalBindings = async () => {
  const bindings = await createLocalBindings_();

  const WF_STORE_POST_LOG = createWorkflowLocal(StorePostLogWorkflowEntrypoint, bindings);

  const SEND_NOTIFICATION = ((): SendNotificationEntrypoint => {
    if (!GOOGLE_CREDENTIALS_BASE64) {
      return {
        sendNotification: () => {
          return Promise.resolve({ id: '' });
        },
      } as unknown as SendNotificationEntrypoint;
    }

    return createWorkerEntrypointLocal(SendNotificationEntrypoint, {
      ...bindings,
      GOOGLE_CREDENTIALS_BASE64,
    });
  })();

  return { ...bindings, WF_STORE_POST_LOG, SEND_NOTIFICATION };
};
