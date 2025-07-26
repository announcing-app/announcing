import { fetchChannel } from '$lib/fetch/fetchChannel';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, fetch }) => {
  const channel = await fetchChannel(params.channelID, fetch);
  if (!channel) {
    redirect(303, '/');
  }

  return { channel };
};
