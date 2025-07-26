export type TagSub = {
  tag: string;
  sub: number;
};

export const parseTagSub = (s: string): TagSub => {
  const [tag, sub] = s.split(':');
  if (!tag || !sub) {
    throw new Error(`TagSub format error: [${s}]`);
  }

  return {
    tag,
    sub: +sub,
  };
};

// https://github.com/drizzle-team/drizzle-orm/issues/1292
export const isTuple = <T>(array: T[], gt = 0): array is [T, ...T[]] => {
  return array.length > gt;
};
