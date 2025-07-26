import { expect, test } from 'vitest';
import { genDatePrefix } from '../src/utils/genDatePrefix';

test('sort order', () => {
  const d = new Date('2025-01-01T00:00:00Z');
  let s = '';
  for (let i = 0; i < 200000; i++) {
    const p = genDatePrefix(d.getTime());
    if (p < s) {
      throw new Error(`Invalid order: (${i}) [${p}] [${s}]`);
    }
    if (i % 1000 === 0) {
      // console.log(d.toISOString(), p);
    }
    d.setDate(d.getDate() + 1);
    s = p;
  }
});

test('same date', () => {
  const d1 = new Date('2025-01-01T00:00:00Z');
  const d2 = new Date('2025-01-01T23:59:59Z');
  expect(genDatePrefix(d1.getTime()) === genDatePrefix(d2.getTime())).toBeTruthy();
});
