import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
  const userID = (await locals.auth())?.user?.id;
  if (!userID) {
    error(400, 'Missing userID');
  }

  const channelID = params.channelID;
  const channel = await locals.db.getChannel({ userID, channelID });
  if (!channel) {
    return error(404);
  }
  return Response.json(channel);
};
