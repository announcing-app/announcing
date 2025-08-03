<script lang="ts">
  import Spinner from '$lib/atoms/Spinner.svelte';
  import VirtualScrollList from '$lib/atoms/VirtualScrollList.svelte';
  import { parseImageSize } from '$lib/utils/parseImageSize';
  import { toHtml } from '$lib/utils/toHtml';
  import { LL } from '@announcing/i18n';
  import { onMount } from 'svelte';
  import type { ChannelViewProps } from '../types';
  import Item from './Item.svelte';

  let { channel, announcementHrefPrefix, announcementKeys, announcementLoader }: ChannelViewProps =
    $props();

  let stuck = $state(false);

  onMount(() => {
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          stuck = entry.intersectionRatio < 1;
        }
      },
      { threshold: [1] },
    );

    const el = document.querySelector('.channel-name');
    if (el) {
      ob.observe(el);
    }

    return () => {
      ob.disconnect();
    };
  });
</script>

{#if channel}
  <div class="channel-name" class:stuck>
    <div class="normal">
      <div class="name">
        {channel.name}
      </div>
      {#if channel.icon}
        <img class="icon" alt={channel.name} src={channel.icon} {...parseImageSize(channel.icon)} />
      {/if}
    </div>
    <button
      class="unstyled small"
      onclick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      <div class="name">
        {channel.name}
      </div>
      {#if channel.icon}
        <img class="icon" alt={channel.name} src={channel.icon} {...parseImageSize(channel.icon)} />
      {/if}
    </button>
  </div>
  {#if channel.desc}
    <div class="channel-desc">
      {@html toHtml(channel.desc)}
    </div>
  {/if}
{/if}

{#if announcementKeys && announcementLoader}
  {#if announcementKeys.length === 0}
    <div class="no-announcements">
      {$LL.noAnnouncements()}
    </div>
  {:else}
    <VirtualScrollList keys={announcementKeys} itemMinHeight={200} gap={8}>
      {#snippet itemSnippet(key)}
        <hr />
        <a class="item unstyled" href={`${announcementHrefPrefix}/${key}`}>
          {#await announcementLoader(key)}
            <div class="loading">
              <Spinner />
            </div>
          {:then announcement}
            {#if announcement}
              <Item {announcement} />
            {/if}
          {:catch}
            <div class="error">{$LL.failedToDataLoad()}</div>
          {/await}
        </a>
      {/snippet}
    </VirtualScrollList>
  {/if}
{/if}

<style lang="scss">
  .channel-name {
    position: sticky;
    top: -1px;
    z-index: 999;
    margin-bottom: 16px;

    padding: 0 16px;

    .name {
      font-weight: bold;
    }
    .icon {
      border-radius: 16px;
      object-fit: contain;
    }

    .normal {
      display: flex;
      align-items: center;
      gap: 8px;
      .name {
        font-size: 20px;
        flex-grow: 1;
      }
      .icon {
        width: 64px;
        height: 64px;
      }
    }

    .small {
      visibility: hidden;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background-color: var(--color-background);
      padding: 8px 16px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .icon {
        width: 32px;
        height: 32px;
      }
    }

    &.stuck {
      .normal {
        visibility: hidden;
      }
      .small {
        visibility: visible;
      }
    }
  }

  .channel-desc {
    margin: 0 8px 16px;
    white-space: pre-line;
  }

  .no-announcements {
    margin-top: 32px;
    text-align: center;
  }

  hr {
    border-top: 1px solid var(--color-border);
    margin-bottom: 16px;
  }

  .item {
    padding: 0 16px 8px;
    display: flex;
    flex-direction: column;
    min-height: 200px;
    max-height: 50svh;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    .loading,
    .error {
      margin: auto;
    }

    &:has(.error) {
      cursor: default;
      pointer-events: none;
    }
  }
</style>
