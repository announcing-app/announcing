<script lang="ts">
  import { LL } from '@announcing/i18n';

  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { PUBLIC_READER_PREFIX } from '$env/static/public';
  import ChannelEditor from '$lib/components/ChannelEditor.svelte';

  import { clearChannelCache } from '$lib/fetch/channelCache';
  import CopyModal from '@announcing/components/CopyModal.svelte';
  import {
    MaterialSymbolsBoxEditOutline,
    MaterialSymbolsContentCopyOutline,
    MaterialSymbolsDangerous,
    MaterialSymbolsEditDocumentOutline,
    MaterialSymbolsPostAdd,
    MdiExternalLink,
  } from '@announcing/components/icons';
  import type { PageData } from './$types';
  import DeleteModal from './DeleteModal.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let urlCopyModal: ReturnType<typeof CopyModal>;
  let deleteModal: ReturnType<typeof DeleteModal>;
  let channelEditor: ReturnType<typeof ChannelEditor>;

  let { channel } = $derived(data);
  let channelID = $derived(channel.channelID);
  let readerURL = $derived(`${PUBLIC_READER_PREFIX}/${channelID}`);

  const updateChannel = async (formData: FormData) => {
    formData.append('updatedAt', channel.updatedAt + '');
    const res = await fetch(`/api/channels/${channelID}`, {
      method: 'PUT',
      body: formData,
    });

    if (!res.ok) {
      await goto('/error');
      return;
    }

    await clearChannelCache();
  };

  const deleteChannel = async () => {
    const res = await fetch(`/api/channels/${channelID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updatedAt: channel.updatedAt }),
    });

    if (!res.ok) {
      await goto('/error');
      return;
    }

    await clearChannelCache();

    await goto('/');
  };

  const iconProps = {
    width: '24px',
    height: '24px',
  };
</script>

<div class="container">
  <div class="actions">
    <a class="action card" href={`${page.url.pathname}/announcements`}>
      <MaterialSymbolsPostAdd {...iconProps} />
      {$LL.createAnnouncement()}
    </a>
    <a class="action card" href={`${page.url.pathname}/announcements/list`}>
      <MaterialSymbolsEditDocumentOutline {...iconProps} />
      {$LL.editAnnouncement()}</a
    >
    <a class="action card" href={readerURL}>
      <MdiExternalLink {...iconProps} />
      {$LL.viewChannel()}</a
    >
    <button
      class="action unstyled card"
      onclick={() => {
        urlCopyModal.openModal(readerURL);
      }}
    >
      <MaterialSymbolsContentCopyOutline {...iconProps} />
      {$LL.copyChannelURL()}</button
    >
    <button
      class="action unstyled card"
      onclick={() => {
        channelEditor.openEditor(channel);
      }}
    >
      <MaterialSymbolsBoxEditOutline {...iconProps} />
      {$LL.editChannel()}</button
    >
    <button
      class="action unstyled card"
      onclick={() => {
        deleteModal.openModal();
      }}
    >
      <MaterialSymbolsDangerous {...iconProps} />
      {$LL.deleteChannel()}</button
    >
  </div>
</div>

<CopyModal bind:this={urlCopyModal} />
<DeleteModal bind:this={deleteModal} name={channel.name} onSubmit={deleteChannel} />
<ChannelEditor bind:this={channelEditor} onSubmit={updateChannel} />

<style lang="scss">
  .container {
    padding: 0 16px;

    .actions {
      display: flex;
      gap: 24px;
      flex-direction: column;
      max-width: 320px;
      margin: 0 auto;

      .action {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
    }
  }
</style>
