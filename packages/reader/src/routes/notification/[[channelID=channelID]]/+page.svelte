<script lang="ts">
  import { fetchChannel } from '$lib/fetch/fetchChannel';
  import { postNotification } from '$lib/fetch/postNotification';
  import { getNotificationToken } from '$lib/notification/firebase';
  import { saveNotificationChannels } from '$lib/notification/localStorage';
  import { back } from '@announcing/components/actions/back';
  import Loading from '@announcing/components/Loading.svelte';
  import { LL } from '@announcing/i18n';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import UnsupportedView from './UnsupportedView.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let notificationStatus = $derived(data.notificationStatus);

  let loading = $state(false);
  let channels = $derived(notificationStatus.supported ? [...notificationStatus.channels] : []);
  let permission = $state<NotificationPermission>('granted');
  let searchText = $state('');
  let searchChannelID = $derived.by(() => {
    const channelIDRegex = /^[0-9]{4,8}$/;
    if (channelIDRegex.test(searchText)) {
      return searchText;
    }

    try {
      const url = new URL(searchText);
      const p = url.pathname.substring(1);
      if (channelIDRegex.test(p)) {
        return p;
      }
    } catch {
      //
    }
    return;
  });
  let channelNotFound = $state(false);
  let registered = $state(false);

  onMount(() => {
    if (data.notificationStatus.supported) {
      permission = Notification.permission;
    }
  });

  const searchClickHandler = async () => {
    channelNotFound = false;

    if (!searchChannelID) {
      return;
    }
    if (channels.find((v) => v.channelID === searchChannelID)) {
      searchText = '';
      return;
    }
    loading = true;
    try {
      const channel = await fetchChannel(searchChannelID);
      if (!channel) {
        channelNotFound = true;
        return;
      }
      channels = [{ ...channel, status: false }, ...channels];
    } finally {
      searchText = '';
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

      const enabledChannels = Object.fromEntries(
        channels
          .filter((v) => {
            return v.status === true;
          })
          .map((v) => {
            return [v.channelID, { name: v.name }];
          }),
      );

      saveNotificationChannels(enabledChannels);

      await postNotification({ token, tags: Object.keys(enabledChannels) });

      registered = true;
    } finally {
      loading = false;
    }
  };
</script>

{#if !notificationStatus.supported}
  <UnsupportedView channel={notificationStatus.channel} />
{:else}
  <div class="container">
    {#if !data.channelID}
      <div class="search-box">
        <div class="info">{$LL.channelNumberOrURL()}</div>
        <div class="input-box">
          <input bind:value={searchText} /><button
            onclick={searchClickHandler}
            disabled={!searchChannelID}>{$LL.search()}</button
          >
        </div>
        {#if channelNotFound}
          <div
            class="error"
            onanimationend={() => {
              channelNotFound = false;
            }}
          >
            {$LL.channelNotFound()}
          </div>
        {/if}
      </div>
    {/if}

    <div class="desc">{$LL.updateNotificationDesc()}</div>

    <div class="channels">
      {#each channels as channel (channel.channelID)}
        <label class="channel card">
          {#if channel.status === 'deleted'}
            <input type="checkbox" disabled /><span class="name">{channel.name}</span><span
              >(deleted)</span
            >
          {:else}
            <!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
            <!-- svelte-ignore binding_property_non_reactive -->
            <input type="checkbox" value={channel.channelID} bind:checked={channel.status} />
            <span class="name">{channel.name}</span>
            {#if channel.icon}
              <img src={channel.icon} alt="icon" />
            {/if}
            <a href={`/${channel.channelID}`} class="button small view" target="_blank"
              >{$LL.view()}</a
            >
          {/if}
        </label>
      {/each}
    </div>

    <button
      class="update-btn"
      class:registered
      onclick={updateClickHandler}
      onanimationend={() => {
        registered = false;
      }}>{registered ? $LL.registered() : $LL.registerNotification()}</button
    >

    {#if permission === 'denied'}
      <div class="denied">
        {$LL.notificationDenied()}
      </div>
    {/if}
  </div>
{/if}

{#if data.channelID}
  <a class="button small back" href={`/${data.channelID}`} use:back>{$LL.back()}</a>
{/if}

<Loading show={loading} />

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    padding: 0 16px;
    gap: 24px;

    .search-box {
      display: flex;
      flex-direction: column;
      align-items: center;

      .input-box {
        margin-top: 8px;
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

      .error {
        margin: 8px 0 0;
        animation: 1s showDelay;
      }
      @keyframes showDelay {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }

    .desc {
      font-size: 15px;
      color: var(--color-text-subtle);
      margin: 0 16px;
    }

    .channels {
      display: grid;
      gap: 4px;
      justify-content: center;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

      .channel {
        padding: 8px;
        min-height: 82px;

        display: flex;
        align-items: center;
        gap: 8px;

        input {
          flex-shrink: 0;
        }

        .name {
          flex-grow: 1;
        }
        img {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          object-fit: contain;
        }
        .view {
          font-size: 14px;
        }
      }
    }

    .update-btn {
      margin: 0 auto 0;

      &.registered {
        animation: 2s showDelay;
        background-color: transparent;
        color: var(--color-text-subtle);
        cursor: default;
        pointer-events: none;
      }

      @keyframes showDelay {
        0% {
          opacity: 0;
        }
        50%,
        100% {
          opacity: 1;
        }
      }
    }

    .denied {
      color: var(--color-error);
    }
  }

  .back {
    margin: 32px auto 0;
  }
</style>
