import linkifyHtml from 'linkify-html';

export const toHtml = (s: string) => {
  return linkifyHtml(s, {
    defaultProtocol: 'https',
    target: '_blank',
    rel: 'nofollow noreferrer',
  });
};
