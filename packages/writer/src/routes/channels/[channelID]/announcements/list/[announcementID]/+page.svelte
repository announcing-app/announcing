<script lang="ts">
  import { goto } from '$app/navigation';
  import { clearChannelCache } from '$lib/fetch/channelCache';
  import { back } from '@announcing/components/actions/back';
  import AnnouncementView from '@announcing/components/AnnouncementView.svelte';
  import { LL } from '@announcing/i18n';
  import type { PageData } from './$types';
  import DeleteModal from './DeleteModal.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let deleteModal: ReturnType<typeof DeleteModal>;

  const deleteAnnouncement = async () => {
    const res = await fetch(
      `/api/channels/${data.channelID}/announcements/${data.announcementID}`,
      {
        method: 'DELETE',
        body: JSON.stringify({ updatedAt: data.announcement.updatedAt }),
      },
    );
    if (!res.ok) {
      await goto('/error');
      return;
    }

    await clearChannelCache();

    await goto('../list');
  };
</script>

<AnnouncementView announcement={data.announcement} />

<div class="buttons">
  <a class="button" href={`/channels/${data.channelID}/announcements/${data.announcementID}`}
    >{$LL.edit()}</a
  >
  <button
    onclick={() => {
      deleteModal.openModal();
    }}>{$LL.delete()}</button
  >
</div>

<a class="button small back" href="../list" use:back>{$LL.back()}</a>

<DeleteModal bind:this={deleteModal} onSubmit={deleteAnnouncement} />

<style lang="scss">
  .buttons {
    display: flex;
    gap: 24px;
    padding: 0 8px;
    margin: 32px auto;
    * {
      width: 120px;
    }
  }
  .back {
    margin: 0 auto;
  }
</style>
