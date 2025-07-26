<script lang="ts">
  import { page } from '$app/state';
  import {
    addFavorite,
    deleteFavorite,
    getFavorites,
    updateLastReadID,
    type Favorite,
  } from '$lib/favorites/favorites';
  import { fetchAnnouncement } from '$lib/fetch/fetchAnnouncement';
  import { isIOS } from '$lib/platform/platform';
  import ChannelView from '@announcing/components/ChannelView.svelte';
  import ConfirmModal from '@announcing/components/ConfirmModal.svelte';
  import CopyModal from '@announcing/components/CopyModal.svelte';
  import { SolarStarBold, SolarStarLinear } from '@announcing/components/icons';
  import Loading from '@announcing/components/Loading.svelte';
  import { createSnapshotContext } from '@announcing/components/snapshotContext';
  import { LL } from '@announcing/i18n';
  import { onMount, type ComponentProps } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let favorite = $state<Favorite>();
  let loading = $state(false);
  let saveLastRead = false;

  let copyModal: CopyModal;
  let confirmModal: ConfirmModal;

  export const snapshot = createSnapshotContext();

  let channelViewProps = $derived({
    channel: data.channel,
    announcementHrefPrefix: page.url.pathname,
    announcementKeys: data.channel.announcementIDs ?? [],
    announcementLoader: async (key: string) => {
      const res = await fetchAnnouncement({
        channelID: data.channelID,
        announcementID: key,
      });
      if (!saveLastRead) {
        const lastID = data.channel.announcementIDs?.[0];
        if (lastID) {
          updateLastReadID(data.channelID, lastID);
        }
      }
      return res;
    },
  } satisfies ComponentProps<typeof ChannelView>);

  const checkFavorites = () => {
    const favorites = getFavorites();
    favorite = favorites.find((v) => v.channelID === data.channelID);
  };

  onMount(() => {
    checkFavorites();
    saveLastRead = false;
  });

  const AddFavoriteCLickHandler = () => {
    addFavorite(data.channel);
    checkFavorites();
  };
  const inFavoriteClickHandler = async () => {
    if (!favorite?.notification) {
      loading = true;
      try {
        await deleteFavorite(data.channelID);
        checkFavorites();
      } finally {
        loading = false;
      }
    } else {
      confirmModal.openModal({
        message: $LL.removeFavoriteConfirm(),
        onOK: async () => {
          loading = true;
          try {
            await deleteFavorite(data.channelID);
            checkFavorites();
          } finally {
            loading = false;
          }
        },
      });
    }
  };
</script>

<svelte:head>
  <title>{data.channel.name}</title>
</svelte:head>

<div class="buttons">
  {#if isIOS()}
    <button
      class="small copy-id"
      onclick={() => {
        copyModal.openModal(data.channelID);
      }}>{$LL.copyID()}</button
    >
  {/if}
  {#if favorite}
    <button class="small in-favorites" in:fade onclick={inFavoriteClickHandler}>
      <SolarStarBold />
      <span>{$LL.inFavorites()}</span></button
    >
  {:else}
    <button class="small add-favorites" in:fade onclick={AddFavoriteCLickHandler}>
      <SolarStarLinear />
      <span>{$LL.addFavorites()}</span></button
    >
  {/if}
</div>

<ChannelView {...channelViewProps} />

<CopyModal bind:this={copyModal} />

<ConfirmModal bind:this={confirmModal} />

<Loading show={loading} />

<style lang="scss">
  .buttons {
    display: flex;
    justify-content: end;
    gap: 8px;
    margin: 16px;

    .copy-id {
      font-size: 13px !important;
    }
    .add-favorites,
    .in-favorites {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px !important;
    }
  }
</style>
