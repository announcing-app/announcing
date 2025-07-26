import { expect, test } from 'vitest';
import { genAnnouncementID } from '../src/utils';
import { decodeAnnouncementID, incAnnouncementID } from '../src/utils/genAnnouncementID';

test('normal', () => {
  expect(genAnnouncementID(new Date('2024-01-01T00:00:00+00:00').getTime())).toEqual('');
  expect(genAnnouncementID(new Date('2025-01-01T00:00:00+00:00').getTime())).toEqual('');
  expect(genAnnouncementID(new Date('2025-01-01T00:00:01+00:00').getTime())).toEqual('1');
  expect(genAnnouncementID(new Date('2026-01-01T00:00:00+00:00').getTime())).toEqual('1uJE0');
  expect(genAnnouncementID(new Date('2026-01-01T00:00:01+00:00').getTime())).toEqual('1uJE1');
  expect(genAnnouncementID(new Date('2100-01-01T00:00:01+00:00').getTime())).toEqual('2D4T61');
});

test('increment', () => {
  expect(incAnnouncementID('1')).toEqual('1.1');
  expect(incAnnouncementID('1.1')).toEqual('1.2');
});

test('decode', () => {
  const t = new Date('2026-01-01T00:00:01+00:00').getTime();
  const id = genAnnouncementID(t);
  expect(decodeAnnouncementID(id)).toEqual(t);
});

test('decode updated', () => {
  const t = new Date('2026-01-01T00:00:01+00:00').getTime();
  const id = genAnnouncementID(t);

  const id2 = incAnnouncementID(id);
  expect(decodeAnnouncementID(id2)).toEqual(t);
});

test('decode error', () => {
  expect(() => decodeAnnouncementID('@')).toThrow();
});
