import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
  const { channelID, announcementID } = params;

  const result = await locals.db.getAnnouncement({ channelID, announcementID });
  if (!result) {
    error(404, 'Missing announcement');
  }

  return json(result);
};
