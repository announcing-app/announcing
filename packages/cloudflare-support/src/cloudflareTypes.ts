export type {
  D1Database as CFD1Database,
  KVNamespace as CFKVNamespace,
  R2Bucket as CFR2Bucket,
  SendEmail as CFSendEmail,
} from '@cloudflare/workers-types';

export type CFCaches = {
  default: Cache;
};
export type CFWaitUntil = (promise: Promise<unknown>) => void;
