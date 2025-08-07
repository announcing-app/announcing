<script lang="ts">
  import { PUBLIC_HELP_PREFIX } from '$env/static/public';
  import { updateFavorites } from '$lib/favorites/favorites';
  import {
    fetchFavoriteChannels,
    type FavoriteChannel,
  } from '$lib/favorites/fetchFavoriteChannels';
  import { postNotification } from '$lib/fetch/postNotification';
  import { getNotificationToken } from '$lib/notification/firebase';
  import { isIOS } from '$lib/platform/platform';
  import Loading from '@announcing/components/Loading.svelte';
  import Spinner from '@announcing/components/Spinner.svelte';
  import { LL, locale } from '@announcing/i18n';
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let channels = $state<FavoriteChannel[]>([]);
  let channelsSaved: typeof channels;
  let editing = $state(false);
  let loading = $state(false);
  let notificationDenied = $state(false);

  onMount(() => {
    const abort = fetchFavoriteChannels((v) => {
      channels = v;
    });

    return () => {
      abort();
    };
  });

  const updateClickHandler = async () => {
    notificationDenied = false;
    loading = true;
    try {
      if (data.supported) {
        const notificationChannels = channels.filter((v) => v.notification).map((v) => v.channelID);
        let permission = Notification.permission;
        if (permission === 'default') {
          const notificationActive = !!channelsSaved.find((v) => v.notification);
          if (notificationActive || notificationChannels.length > 0) {
            permission = await Notification.requestPermission();
          }
        }

        if (permission === 'denied') {
          if (notificationChannels.length > 0) {
            notificationDenied = true;
            return;
          }
        }

        if (permission === 'granted') {
          const token = await getNotificationToken();
          await postNotification({ token, tags: notificationChannels });
        }
      }
      updateFavorites(channels);
      editing = false;
    } finally {
      loading = false;
    }
  };
</script>

<svelte:head>
  <title>{$LL.favoritesList()}</title>
</svelte:head>

<div class="header">
  <div class="title">{$LL.favoritesList()}</div>
  {#if editing}
    <button class="small" in:scale onclick={updateClickHandler}>{$LL.update()}</button>
    <button
      class="unstyled cancel"
      in:scale
      onclick={() => {
        channels = channelsSaved;
        editing = false;
      }}>{$LL.cancel()}</button
    >
  {:else}
    <button
      class="small"
      in:scale
      onclick={() => {
        channelsSaved = $state.snapshot(channels);
        editing = true;
        notificationDenied = false;
      }}>{$LL.edit()}</button
    >
  {/if}
</div>

{#if editing}
  {#if data.supported}
    <div class="desc" in:fade|global class:error={notificationDenied}>
      {notificationDenied ? $LL.notificationPermissionError() : $LL.editFavoritesDesc()}
    </div>
  {:else if isIOS()}
    <div in:fade|global class="desc ios">
      <a class="link" href={`${PUBLIC_HELP_PREFIX}/${$locale}/ios_notification`}
        >{$LL.unsupportedNotificationIOS()}</a
      >
    </div>
  {:else}
    <div in:fade|global class="desc error">
      {$LL.unsupportedNotification()}
    </div>
  {/if}
{/if}

{#if channels.length === 0}
  <div class="no-favorites">{$LL.noFavorites()}</div>
{/if}

<div class="channels">
  {#each channels as channel (channel.channelID)}
    {@const unread = channel.status === 'LOADED' && channel.unread > 0}
    <svelte:element
      this={editing ? 'label' : 'a'}
      class="card channel"
      class:deleted={channel.status === 'NOT_FOUND'}
      href={`/${channel.channelID}`}
    >
      {#if editing && data.supported}
        <!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
        <!-- svelte-ignore binding_property_non_reactive -->
        <input type="checkbox" in:scale|global bind:checked={channel.notification} />
      {/if}
      <span class="name" class:unread>{channel.name}</span>
      {#if channel.icon}
        <img src={channel.icon} alt="icon" />
      {/if}
      {#if channel.status === 'LOADING'}
        <Spinner size={9} />
      {/if}
      {#if editing}
        <button
          class="unstyled error delete"
          in:scale
          onclick={() => {
            channels = channels.filter((v) => {
              return v.channelID !== channel.channelID;
            });
          }}>{$LL.delete()}</button
        >
      {/if}
    </svelte:element>
  {/each}
</div>

<Loading show={loading} />

<style lang="scss">
  .header {
    margin: 16px 16px 0;
    display: flex;
    align-items: center;
    gap: 8px;

    .title {
      color: var(--color-text-subtle);
      flex-grow: 1;
    }

    .cancel {
      display: inline-block;
      font-weight: normal;
      font-size: 14px;
      color: var(--color-text-subtle);
    }
  }

  .desc {
    padding: 32px 32px 0;
    font-size: 14px;
    margin: 0 auto;
    &:not(.error) {
      color: var(--color-text-subtle);
    }
  }

  .no-favorites {
    margin: 48px auto;
    color: var(--color-text-subtle);
  }

  .channels {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;

    .channel {
      display: flex;
      align-items: center;
      gap: 8px;

      &.deleted {
        .name,
        img {
          opacity: 0.5;
        }
      }

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        flex: 1;

        &.unread {
          font-weight: bold;
        }
      }
      img {
        width: 32px;
        height: 32px;
        border-radius: 8px;
      }
      .delete {
        font-size: 13px;
        display: inline-block;
        margin: 0 0 0 8px;
      }
    }
  }
</style>
