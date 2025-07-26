const BASE_DATE = Date.UTC(2025, 0, 1, 0, 0, 0, 0);
const DATE_MSEC = 24 * 60 * 60 * 1000;
const CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const CHARACTERS_LENGTH = CHARACTERS.length;

export const genDatePrefix = (v: number) => {
  let n = Math.trunc((v - BASE_DATE) / DATE_MSEC);

  let s = '';

  while (n > 0) {
    s = `${CHARACTERS[n % CHARACTERS_LENGTH]}${s}`;
    n = Math.trunc(n / CHARACTERS_LENGTH);
  }

  return s.padStart(3, '0');
};
