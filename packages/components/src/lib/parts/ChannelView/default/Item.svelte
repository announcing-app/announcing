<script lang="ts">
  import ResizeObserver from '$lib/atoms/ResizeObserver.svelte';
  import AnnouncementView from '$lib/parts/AnnouncementView/AnnouncementView.svelte';
  import { formatDate } from '$lib/utils/formatDate';
  import { parseImageSize } from '$lib/utils/parseImageSize';
  import type { ComponentProps } from 'svelte';

  type Announcement = ComponentProps<typeof AnnouncementView>['announcement'];

  interface Props {
    announcement: Announcement;
  }

  let { announcement }: Props = $props();

  let firstImage = $derived(announcement.images?.[0]);

  let overflow = $state(false);
</script>

<ResizeObserver
  onResize={({ el }) => {
    overflow = el.scrollHeight > el.clientHeight;
  }}
>
  <div class="container" class:overflow>
    {#if announcement.headerImage}
      {@const size = parseImageSize(announcement.headerImage)}
      <img
        class="header-image"
        src={announcement.headerImage}
        alt=""
        width={size?.width}
        height={size?.height}
        class:portrait={size ? size.height > size.width : false}
      />
    {/if}
    <div class="date">{formatDate(announcement.createdAt)}</div>
    {#if announcement.title}
      <div class="title">{announcement.title}</div>
    {/if}
    <div class="body">{announcement.body}</div>
    {#if firstImage}
      <img class="first-image" src={firstImage} alt="" {...parseImageSize(firstImage)} />
    {/if}
  </div>
</ResizeObserver>

<style lang="scss">
  .container {
    max-height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 8px 8px 0;

    .header-image {
      display: block;
      max-height: 30dvh;
      object-fit: cover;
      border: none;
      border-radius: 16px;
      margin: 0 auto 16px;
      &.portrait {
        object-fit: contain;
        width: fit-content;
      }
    }

    &.overflow:after {
      position: absolute;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      content: '';
      background: linear-gradient(to top, var(--color-background), transparent 10%);
      pointer-events: none;
    }

    .date {
      color: var(--color-text-subtle);
      font-size: 15px;
    }

    .title {
      font-size: 18px;
      font-weight: bold;
    }

    .body {
      white-space: pre-wrap;
    }

    .first-image {
      border-radius: 16px;
      object-fit: contain;
      width: fit-content;
      height: fit-content;
      margin: 8px auto 0;
    }
  }
</style>
