const BASE_DATE = Date.UTC(2025, 0, 1, 0, 0, 0, 0);
const CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
const CHARACTERS_LENGTH = CHARACTERS.length;

const toID = (n: number) => {
  let s = '';

  while (n > 0) {
    s = `${CHARACTERS[n % CHARACTERS_LENGTH]}${s}`;
    n = Math.trunc(n / CHARACTERS_LENGTH);
  }

  return s;
};

export const genAnnouncementID = (createdAt: number) => {
  return toID(Math.trunc((createdAt - BASE_DATE) / 1000));
};

const idSuffix = /^(.+)\.([0-9]+)$/;

export const incAnnouncementID = (id: string) => {
  const m = id.match(idSuffix) as [string, string, string] | null;
  if (m) {
    const [, p, s] = m;
    const suffix = parseInt(s);
    return `${p}.${suffix + 1}`;
  } else {
    return `${id}.1`;
  }
};

const fromID = (id: string): number => {
  let n = 0;

  for (const char of id.split('')) {
    const index = CHARACTERS.indexOf(char);

    if (index === -1) {
      throw new Error(`Invalid character '${char}' in ID`);
    }

    n = n * CHARACTERS_LENGTH + index;
  }

  return n * 1000 + BASE_DATE;
};

export const decodeAnnouncementID = (announcementID: string) => {
  const m = announcementID.match(idSuffix) as [string, string] | null;
  if (!m) {
    return fromID(announcementID);
  }
  return fromID(m[1]);
};
