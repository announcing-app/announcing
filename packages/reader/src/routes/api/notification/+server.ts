import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';

const postSchema = v.strictObject({
  token: v.pipe(v.string(), v.nonEmpty()),
  tags: v.array(v.pipe(v.string(), v.nonEmpty(), v.maxLength(100))),
});

export const POST: RequestHandler = async ({ locals, request }) => {
  const data = await request.json();

  if (!v.is(postSchema, data)) {
    error(400);
  }

  await locals.putToken(data);

  return json({});
};
