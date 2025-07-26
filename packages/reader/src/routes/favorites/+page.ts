import { isSupported } from 'firebase/messaging';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const supported = await isSupported();

  return {
    supported,
  };
};
