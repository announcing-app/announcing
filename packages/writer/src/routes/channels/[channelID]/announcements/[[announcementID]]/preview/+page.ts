import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
  return {
    backHref: url.href.replace('/preview', ''),
  };
};
