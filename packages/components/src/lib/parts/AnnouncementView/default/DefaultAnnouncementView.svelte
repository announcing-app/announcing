<script lang="ts">
  import { pushState } from '$app/navigation';
  import { page } from '$app/state';
  import Modal from '$lib/atoms/Modal.svelte';
  import { formatDate } from '$lib/utils/formatDate';
  import { toHtml } from '$lib/utils/toHtml';
  import { LL } from '@announcing/i18n';
  import type { ComponentProps } from 'svelte';
  import AnnouncementView from '../AnnouncementView.svelte';
  import { parseImageSize } from '$lib/utils/parseImageSize';

  type Props = ComponentProps<typeof AnnouncementView>;

  let { channel, announcement }: Props = $props();

  let imageModalSrc: string | undefined = $derived(page.state.announcementViewZoomImage?.src);

  const showImageModal = (src: string) => {
    pushState('', { ...page.state, announcementViewZoomImage: { src } });
  };
</script>

{#if channel}
  <button
    class="unstyled channel"
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
{/if}

<div class="announcement">
  {#if announcement.headerImage}
    <button
      class="unstyled"
      onclick={() => {
        if (announcement.headerImage) {
          showImageModal(announcement.headerImage);
        }
      }}
    >
      <img
        class="header-image"
        alt=""
        src={announcement.headerImage}
        {...parseImageSize(announcement.headerImage)}
      />
    </button>
  {/if}
  <div class="date">
    {#if announcement.createdAt === announcement.updatedAt}
      <div>{formatDate(announcement.createdAt)}</div>
    {:else}
      <div>{$LL.createdAtPrefix()}{formatDate(announcement.createdAt)}</div>
      <div>{$LL.updatedAtPrefix()}{formatDate(announcement.updatedAt)}</div>
    {/if}
  </div>
  {#if announcement.title}
    <div class="title">
      {announcement.title}
    </div>
  {/if}
  <div class="body">
    {@html toHtml(announcement.body)}
  </div>
  {#if announcement.images}
    <div class="images-box">
      {#if announcement.images.length === 1}
        {@const image = announcement.images[0] as string}
        <button
          class="unstyled image-box"
          onclick={() => {
            if (image) {
              showImageModal(image);
            }
          }}
        >
          <img class="single-image" src={image} alt="" {...parseImageSize(image)} />
        </button>
      {:else}
        <div class="images-grid">
          {#each announcement.images as image (image)}
            <button
              class="unstyled image-box"
              onclick={() => {
                showImageModal(image);
              }}
            >
              <img src={image} alt="" {...parseImageSize(image)} />
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<Modal
  open={!!imageModalSrc}
  dismissMode="anywhere"
  onDismiss={() => {
    const src = page.state.announcementViewZoomImage?.src;
    if (src) {
      history.back();
    }
  }}
>
  <img class="zoom-image" src={imageModalSrc} alt="" {...parseImageSize(imageModalSrc as string)} />
</Modal>

<style lang="scss">
  .channel {
    position: sticky;
    top: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: var(--color-background);
    padding: 8px 16px;
    margin: 0 0 16px;

    .name {
      font-weight: bold;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .icon {
      width: 32px;
      height: 32px;
      border-radius: 16px;
    }
  }

  .announcement {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .header-image {
      max-height: 50vh;
      align-self: center;
      margin: 0 0 8px 0;
      object-fit: contain;
      width: auto;
      height: auto;
      @media (min-width: 600px) {
        border-radius: 16px;
      }
    }
    .date {
      padding: 0 16px;
      color: var(--color-text-subtle);
      font-size: 15px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      padding: 0 16px;
    }
    .body {
      padding: 0 16px;
      white-space: pre-wrap;
      line-height: 1.4;
    }

    .images-box {
      margin: 8px 4px 0;
      display: flex;

      .image-box {
        display: contents;
        cursor: pointer;
      }

      .single-image {
        margin: 0 auto;
        object-fit: contain;
        max-height: 90vh;
        width: auto;
        height: auto;
        @media (min-width: 600px) {
          border-radius: 16px;
        }
      }

      .images-grid {
        display: grid;
        width: 100%;
        // https://ishadeed.com/article/min-content-size-css-grid/
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 4px;

        .image-box {
          display: flex;
          aspect-ratio: 1;
          img {
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: 16px;
            margin: auto;
            width: fit-content;
            height: fit-content;
          }
        }
      }
    }
  }

  .zoom-image {
    margin: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    width: auto;
    height: auto;
  }
</style>
