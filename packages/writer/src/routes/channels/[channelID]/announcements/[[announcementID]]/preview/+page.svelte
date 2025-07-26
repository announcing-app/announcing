<script lang="ts" module>
  type Announcement = {
    title: string | undefined;
    body: string;
    headerImage: string | undefined;
    images: string[] | undefined;
    edit?: {
      announcementID: string;
      updatedAt: number;
      createdAt: number;
    };
  };

  export type AnnouncementPreviewData = {
    channel: { name: string; icon: string | undefined };
    announcement: Announcement;
  };

  const makeFormData = async ({ announcement }: AnnouncementPreviewData) => {
    const formData = new FormData();

    formData.append('body', announcement.body);

    if (announcement.title) {
      formData.append('title', announcement.title);
    }

    if (announcement.headerImage) {
      if (announcement.headerImage.startsWith(APP_CACHES_PREFIX)) {
        const blob = await getBlobOrThrow(window.caches, announcement.headerImage);
        formData.append('headerImage', blob);
      } else {
        formData.append('headerImage', stripStoragePath(announcement.headerImage));
      }
    }

    if (announcement.images) {
      for (const v of announcement.images) {
        if (v.startsWith(APP_CACHES_PREFIX)) {
          const blob = await getBlobOrThrow(window.caches, v);
          formData.append('images', blob);
        } else {
          formData.append('images', stripStoragePath(v));
        }
      }
    }

    if (announcement.edit?.updatedAt) {
      formData.append('targetUpdatedAt', announcement.edit.updatedAt + '');
    }

    return formData;
  };
</script>

<script lang="ts">
  import AnnouncementView from '@announcing/components/AnnouncementView.svelte';
  import Loading from '@announcing/components/Loading.svelte';
  import type { GetAnnouncementResult } from '@announcing/db/types';
  import { LL } from '@announcing/i18n';

  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  import { APP_CACHES_PREFIX, getBlobOrThrow } from '$lib/cacheStorage/cacheStorage';
  import { resolveStoragePath, stripStoragePath } from '$lib/db/resolver';
  import { clearChannelCache } from '$lib/fetch/channelCache';
  import { back } from '@announcing/components/actions/back';
  import type { PageData, Snapshot } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let loading = $state(false);
  let channelID = $derived(page.params['channelID'] as string);
  let announcementID = $derived(page.params['announcementID']);
  let previewData = $state<AnnouncementPreviewData | undefined>(page.state.announcementPreviewData);

  let [channel, announcement] = $derived.by(() => {
    if (!previewData) {
      return [undefined, undefined];
    }

    const now = new Date().getTime();
    if (!previewData.announcement.edit) {
      return [
        previewData.channel,
        {
          ...previewData.announcement,
          updatedAt: now,
          createdAt: now,
        } satisfies GetAnnouncementResult,
      ];
    } else {
      // Just in case
      if (announcementID !== previewData.announcement.edit.announcementID) {
        void goto('/');
        return [undefined, undefined];
      }
      return [
        previewData.channel,
        {
          ...previewData.announcement,
          updatedAt: now,
          createdAt: previewData.announcement.edit.createdAt,
        } satisfies GetAnnouncementResult,
      ];
    }
  });

  const toAnnouncementViewData = (v: Exclude<typeof announcement, undefined>) => {
    const result = { ...v };
    if (result.headerImage) {
      result.headerImage = resolveStoragePath(result.headerImage);
    }
    if (result.images) {
      result.images = result.images.map((v) => resolveStoragePath(v));
    }

    return result;
  };

  export const snapshot = {
    capture: () => {
      return previewData;
    },
    restore: (value) => {
      const stateData = page.state.announcementPreviewData;
      if (!stateData) {
        previewData = value;
      }
    },
  } satisfies Snapshot<AnnouncementPreviewData | undefined>;

  const addAnnouncement = async () => {
    if (!previewData) {
      return;
    }

    const formData = await makeFormData(previewData);
    loading = true;
    try {
      if (announcementID) {
        const res = await fetch(`/api/channels/${channelID}/announcements/${announcementID}`, {
          method: 'PUT',
          body: formData,
        });
        if (!res.ok) {
          await goto('/error');
          return;
        }

        await clearChannelCache();

        await goto(`/channels/${channelID}/announcements/list`);
      } else {
        const res = await fetch(`/api/channels/${channelID}/announcements`, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          await goto('/error');
          return;
        }

        await clearChannelCache();

        await goto(`/channels/${channelID}`);
      }
    } finally {
      loading = false;
    }
  };
</script>

{#if channel && announcement}
  <AnnouncementView announcement={toAnnouncementViewData(announcement)} />
  <button class="submit-btn" onclick={addAnnouncement}
    >{announcementID ? $LL.updateAnnouncement() : $LL.postAnnouncement()}</button
  >
  <a class="button small cancel" href={data.backHref} use:back>{$LL.back()}</a>
{/if}

<Loading show={loading} />

<style lang="scss">
  .submit-btn {
    margin-top: 32px;
    align-self: center;
  }

  .cancel {
    margin-top: 32px;
    align-self: center;
  }
</style>
