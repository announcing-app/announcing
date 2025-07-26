import { createWorkerEntrypointLocal } from '@announcing/cloudflare-support/local';
import { createLocalBindings as createLocalBindings_ } from '@announcing/cloudflare-support/localBindings';
import { PutTokenEntrypoint } from '@announcing/notification';

export const createLocalBindings = async () => {
  const bindings = await createLocalBindings_();

  const WK_PUT_TOKEN = createWorkerEntrypointLocal(PutTokenEntrypoint, bindings);

  return { ...bindings, WK_PUT_TOKEN };
};
