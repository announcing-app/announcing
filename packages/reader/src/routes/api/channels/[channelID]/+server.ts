import { error, json } from '@sveltejs/kit';

import { READER } from '@announcing/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
  const { channelID } = params;

  const result = await locals.db.getChannel({ userID: READER, channelID });
  if (!result) {
    error(404, 'Missing channel');
  }

  return json(result);
};
