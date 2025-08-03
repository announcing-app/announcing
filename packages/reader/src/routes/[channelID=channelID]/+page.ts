import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { channel, ...data } = await parent();

  if (!channel) {
    error(404);
  }

  return { ...data, channel };
};
