<script lang="ts">
  import { goto } from '$app/navigation';
  import ChannelEditor from '$lib/components/ChannelEditor.svelte';
  import { clearChannelCache } from '$lib/fetch/channelCache';
  import { LL } from '@announcing/i18n';
  import { signOut } from '@auth/sveltekit/client';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let createDisabled = $derived(data.channels.length >= 5);

  let editor: ReturnType<typeof ChannelEditor>;

  const submitHandler = async (formData: FormData) => {
    const res = await fetch('/api/channels', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      await goto('/error');
      return;
    }

    await clearChannelCache();
  };
</script>

<header>
  <span>{$LL.writerTitle()}</span>
  <button
    class="small"
    onclick={() => {
      void signOut();
    }}
  >
    {$LL.signOut()}
  </button>
</header>

<div class="container">
  {#if data.channels}
    <div class="channels">
      {#each data.channels as channel (channel.channelID)}
        <a href={`/channels/${channel.channelID}`} class="card channel">
          <span class="name">
            {channel.name}
          </span>
          {#if channel.icon}
            <img alt="icon" src={channel.icon} />
          {/if}
        </a>
      {/each}
    </div>
  {/if}

  <button
    class="create-btn"
    disabled={createDisabled}
    onclick={() => {
      editor.openEditor();
    }}
    >{$LL.createChannel()}
  </button>
  <span class="create-btn-desc">{$LL.channelsCanBeCreated()}</span>
</div>

<ChannelEditor bind:this={editor} onSubmit={submitHandler} />

<style lang="scss">
  header {
    margin: 16px 16px 32px;
    display: flex;
    align-items: center;
    color: var(--color-text-subtle);
    button.small {
      margin-left: auto;
      font-size: 13px;
      padding: 6px 8px;
      border-radius: 12px;
    }
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .channels {
      margin: 0 16px;
      display: grid;
      gap: 16px;
      justify-content: center;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

      .channel {
        min-height: 82px;

        display: flex;
        align-items: center;
        gap: 8px;

        .name {
          flex-grow: 1;
        }
        img {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          object-fit: contain;
        }
      }
    }

    .create-btn {
      margin: 32px auto 0;
    }
    .create-btn-desc {
      margin: 8px auto 32px;
      color: var(--color-text-subtle);
      font-size: 15px;
    }
  }
</style>
