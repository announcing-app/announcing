import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  const userID = (await locals.auth())?.user?.id;
  if (!userID) {
    error(400, 'Missing userID');
  }
  const channels = await locals.db.getChannels({ userID });

  return Response.json(channels);
};
