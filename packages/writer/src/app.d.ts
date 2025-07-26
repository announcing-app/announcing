/// <reference types="@sveltejs/kit" />

import type { createDB } from '@announcing/db';
import type { SendNotificationEntrypoint, SendNotificationParams } from '@announcing/notification';
import type { AnnouncementPreviewData } from './routes/channels/[channelID]/announcements/[[announcementID]]/preview/+page.svelte';
import type { StorePostLogParams, StorePostLogWorkflow } from './workers/storePostLogWorkflow';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      db: ReturnType<typeof createDB>;
      storePostLog: (params: StorePostLogParams) => Promise<void>;
      sendNotification: (params: SendNotificationParams) => Promise<void>;
      waitUntil: (promise: Promise<unknown>) => void;
    }
    // interface PageData {}
    interface PageState {
      fromPage?: string;
      announcementPreviewData?: AnnouncementPreviewData;
    }
    interface Platform {
      env: {
        D1: D1Database;
        R2: R2Bucket;
        WF_STORE_POST_LOG: StorePostLogWorkflow;
        SEND_NOTIFICATION: SendNotificationEntrypoint;
      };
      context: {
        waitUntil: (promise: Promise<unknown>) => void;
      };
    }
  }
}

export {};
