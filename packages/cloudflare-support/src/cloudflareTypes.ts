export type {
  BodyInit as CFBodyInit,
  Cache as CFCache,
  CacheStorage as CFCacheStorage,
  D1Database as CFD1Database,
  KVNamespace as CFKVNamespace,
  R2Bucket as CFR2Bucket,
  ReadableStream as CFReadableStream,
  Request as CFRequest,
  RequestInfo as CFRequestInfo,
  Response as CFResponse,
  SendEmail as CFSendEmail,
} from '@cloudflare/workers-types';

export type CFWaitUntil = (promise: Promise<unknown>) => void;
