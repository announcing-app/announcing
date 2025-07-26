import { PUBLIC_READER_ERROR_TEST } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const GET = () => {
  if (!PUBLIC_READER_ERROR_TEST) {
    error(404);
  }
  throw new Error('Server Error Test');
};
