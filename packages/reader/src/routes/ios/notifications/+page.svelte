<script lang="ts">
  import { updateFavorites } from '$lib/favorites/favorites';
  import {
    fetchFavoriteChannels,
    type FavoriteChannel,
  } from '$lib/favorites/fetchFavoriteChannels';
  import { fetchChannel } from '$lib/fetch/fetchChannel';
  import { postNotification } from '$lib/fetch/postNotification';
  import { getNotificationToken } from '$lib/notification/firebase';
  import Loading from '@announcing/components/Loading.svelte';
  import Spinner from '@announcing/components/Spinner.svelte';
  import { LL } from '@announcing/i18n';
  import { onMount } from 'svelte';
  import { backOut } from 'svelte/easing';
  import { fade, scale } from 'svelte/transition';

  let loading = $state(false);
  let editing = $state(false);
  let searchChannelID = $state('');
  let channels = $state<FavoriteChannel[]>([]);
  let channelsSaved: typeof channels;
  let channelNotFound = $state(false);
  let permission = $state<NotificationPermission>('granted');

  onMount(() => {
    const abort = fetchFavoriteChannels((v) => {
      channels = v;
    });

    return () => {
      abort();
    };
  });

  const searchClickHandler = async () => {
    channelNotFound = false;

    if (!searchChannelID) {
      return;
    }
    if (channels.find((v) => v.channelID === searchChannelID)) {
      searchChannelID = '';
      return;
    }
    loading = true;
    try {
      const channel = await fetchChannel(searchChannelID);
      if (!channel) {
        channelNotFound = true;
        return;
      }
      channels = [
        {
          notification: true,
          lastReadID: channel.announcementIDs?.[0] ?? '',
          ...channel,
          status: 'LOADED',
          unread: 0,
        },
        ...channels,
      ];
    } finally {
      searchChannelID = '';
      loading = false;
    }
  };

  const updateClickHandler = async () => {
    loading = true;
    try {
      permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return;
      }

      const token = await getNotificationToken();
      const tags = channels.map((v) => v.channelID);

      await postNotification({ token, tags });
      updateFavorites(channels);
      editing = false;
    } finally {
      loading = false;
    }
  };
</script>

<svelte:head>
  <title>{$LL.iosNotification()}</title>
</svelte:head>

<div class="header">
  <div class="title">
    {$LL.iosNotification()}
  </div>
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
      }}>{$LL.edit()}</button
    >
  {/if}
</div>
<div class="container">
  {#if editing}
    <div class="input-box" in:fade>
      <input bind:value={searchChannelID} /><button
        onclick={searchClickHandler}
        disabled={!searchChannelID}>{$LL.add()}</button
      >
    </div>
    {#if channelNotFound}
      <div
        class="error not-found"
        in:fade={{ duration: 1000, easing: backOut }}
        onintroend={() => {
          channelNotFound = false;
        }}
      >
        {$LL.channelNotFound()}
      </div>
    {/if}
  {/if}

  {#if !editing && channels.length === 0}
    <div class="no-channels">{$LL.noChannelsAreRegistered()}</div>
  {/if}

  <div class="channels">
    {#each channels as channel (channel.channelID)}
      <svelte:element
        this={editing ? 'div' : 'a'}
        class="card channel"
        class:deleted={channel.status === 'NOT_FOUND'}
        href={`x-safari-https://${location.host}/${channel.channelID}`}
      >
        <span class="name">{channel.name}</span>
        {#if channel.icon}
          <img src={channel.icon} alt="icon" />
        {/if}
        {#if editing}
          <button
            class="unstyled error delete"
            in:scale
            onclick={() => {
              channels = channels.filter((v) => v !== channel);
            }}>{$LL.remove()}</button
          >
        {/if}
        {#if channel.status === 'LOADING'}
          <Spinner size={9} />
        {/if}
      </svelte:element>
    {/each}
  </div>
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
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      margin-right: auto;
    }

    .cancel {
      display: inline-block;
      white-space: nowrap;
      font-weight: normal;
      font-size: 14px;
      color: var(--color-text-subtle);
    }
  }

  .container {
    display: flex;
    flex-direction: column;
    margin: 16px 16px 0;
    gap: 16px;

    .no-channels {
      margin: 32px auto 0;
      color: var(--color-text-subtle);
    }

    .input-box {
      margin: 16px auto 0;
      display: flex;
      width: 100%;
      max-width: 400px;
      input {
        flex-grow: 1;
        text-align: center;
        border-radius: 16px 0 0 16px;
      }
      button {
        border-radius: 0 16px 16px 0;
        padding: 0 16px;
      }
    }

    .not-found {
      margin: 0 auto;
    }

    .channels {
      display: flex;
      flex-direction: column;
      gap: 8px;
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
          opacity: 1;
        }
      }
    }
  }
</style>
