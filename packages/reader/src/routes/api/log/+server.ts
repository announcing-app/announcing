import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  console.dir(data, { depth: null });
  return Response.json({});
};
