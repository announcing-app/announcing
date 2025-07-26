import { fetchChannels } from '$lib/fetch/fetchChannels';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const channels = await fetchChannels(fetch);
  if (!channels) {
    redirect(303, '/signin');
  }
  return { channels };
};
