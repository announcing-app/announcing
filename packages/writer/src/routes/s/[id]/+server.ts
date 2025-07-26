import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
  const id = params.id;

  const res = await locals.db.getStorage(id);

  if (!res) {
    return error(404);
  }

  const { contentType, data } = res;

  return new Response(data, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': data.byteLength.toString(),
    },
  });
};
