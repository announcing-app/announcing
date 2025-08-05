import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  console.log(JSON.stringify(data, undefined, 2));
  return Response.json({});
};
