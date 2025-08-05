import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';

const postSchema = v.strictObject({
  channelID: v.pipe(v.string(), v.nonEmpty()),
  announcementID: v.pipe(v.string(), v.nonEmpty()),
  details: v.pipe(v.string(), v.nonEmpty(), v.maxLength(1000)),
});

export const POST: RequestHandler = async ({ locals, request }) => {
  const data = await request.json();

  if (!v.is(postSchema, data)) {
    error(400);
  }

  await locals.sendEmail(
    'Report Announcement',
    `${data.channelID}/${data.announcementID}\n\n${data.details}`,
  );

  return json({});
};
