<script lang="ts">
  import FileInput from '@announcing/components/FileInput.svelte';
  import Input from '@announcing/components/Input.svelte';
  import TextArea from '@announcing/components/TextArea.svelte';
  import {
    ANNOUNCEMENT_BODY_MAX_BYTES,
    ANNOUNCEMENT_IMAGE_MAX_SIZE,
    ANNOUNCEMENT_TITLE_MAX_BYTES,
  } from '@announcing/db/constants';
  import type { GetAnnouncementResult } from '@announcing/db/types';
  import { LL } from '@announcing/i18n';
  import { onMount } from 'svelte';

  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  import { putBlob, stripPrefix } from '$lib/cacheStorage/cacheStorage';
  import { resolveStoragePath } from '$lib/db/resolver';
  import { back } from '@announcing/components/actions/back';
  import { genStorageKey } from '@announcing/db/utils';
  import type { PageData, Snapshot } from './$types';
  import type { AnnouncementPreviewData } from './preview/+page.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  export const snapshot = {
    capture: () => {
      return form;
    },
    restore: (value) => {
      form = value;
    },
  } satisfies Snapshot<Partial<GetAnnouncementResult>>;

  let form = $state<Partial<GetAnnouncementResult>>({});
  let titleError = $state(false);
  let bodyError = $state(false);
  let { channel, announcement } = $derived(data);
  let validated = $derived.by(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (titleError || bodyError) {
      return false;
    }

    const body = form.body;

    if (!body) {
      return false;
    }

    const data = { ...form, body, createdAt: form.createdAt ?? new Date().getTime() };

    if (data.headerImage) {
      data.headerImage = stripPrefix(data.headerImage);
    }
    if (data.images) {
      data.images = data.images.map((v) => stripPrefix(v));
    }

    return true;
  });

  let headerImageFileInput: ReturnType<typeof FileInput>;
  let imagesFileInput: ReturnType<typeof FileInput>;

  onMount(() => {
    form = { ...announcement };
  });

  const previewClickHandler = () => {
    const { title, body, headerImage, images } = $state.snapshot(form);
    if (!body) {
      return;
    }

    const announcementPreviewData: AnnouncementPreviewData = {
      channel,
      announcement: {
        title,
        body,
        headerImage,
        images,
      },
    };

    if (announcement) {
      announcementPreviewData.announcement.edit = {
        announcementID: page.params['announcementID'] as string,
        updatedAt: announcement.updatedAt,
        createdAt: announcement.createdAt,
      };
    }

    return goto(`${page.url.pathname}/preview`, {
      state: {
        announcementPreviewData,
      },
    });
  };
</script>

<div class="container">
  <div class="header-image">
    {#if form.headerImage}
      <button
        class="unstyled"
        onclick={() => {
          headerImageFileInput.open();
        }}
      >
        <img class="icon" alt="icon preview" src={resolveStoragePath(form.headerImage)} />
      </button>
      <button
        class="small"
        onclick={() => {
          form.headerImage = undefined;
        }}>{$LL.remove()}</button
      >
    {:else}
      <button
        class="small"
        onclick={() => {
          headerImageFileInput.open();
        }}>{$LL.chooseHeaderImage()}</button
      >
    {/if}
    <FileInput
      accept="image/jpeg,image/png,image/webp"
      maxImageSize={ANNOUNCEMENT_IMAGE_MAX_SIZE}
      bind:this={headerImageFileInput}
      onInput={async (blob) => {
        const [key] = await genStorageKey(blob);
        form.headerImage = await putBlob(window.caches, key, blob);
      }}
    />
  </div>
  <Input
    name="title"
    label={$LL.title()}
    bind:value={form.title}
    maxBytes={ANNOUNCEMENT_TITLE_MAX_BYTES}
    bind:error={titleError}
  />
  <TextArea
    name="body"
    label={$LL.body()}
    bind:value={form.body}
    maxBytes={ANNOUNCEMENT_BODY_MAX_BYTES}
    maxHeight="40vh"
    required
    bind:error={bodyError}
  />
  <div class="images-box">
    {#if form.images}
      <div class="images">
        {#each form.images as image (image)}
          <div class="img-box">
            <img alt="" src={resolveStoragePath(image)} />
            <button
              class="small filled"
              onclick={() => {
                form.images = form.images?.filter((v) => {
                  return v !== image;
                });
              }}>{$LL.remove()}</button
            >
          </div>
        {/each}
      </div>
    {/if}
    <button
      class="small"
      onclick={() => {
        imagesFileInput.open();
      }}
      disabled={form.images?.length === 4}>{$LL.addImage()}</button
    >
    <div class="desc">{$LL.addImageDescription()}</div>
    <FileInput
      bind:this={imagesFileInput}
      accept="image/jpeg,image/png,image/webp"
      maxImageSize={ANNOUNCEMENT_IMAGE_MAX_SIZE}
      filesCount={4}
      onInputs={async (blobs) => {
        const images = form.images ? [...form.images] : [];
        for (const blob of blobs) {
          if (images.length === 4) {
            break;
          }
          const [key] = await genStorageKey(blob);
          const exists = !!images.find((v) => v.endsWith(key));
          if (exists) {
            continue;
          }
          images.push(await putBlob(window.caches, key, blob));
        }

        form.images = images;
      }}
    />
  </div>

  <button disabled={!validated} class="preview-btn" onclick={previewClickHandler}
    >{$LL.preview()}</button
  >

  <a class="button small back-btn" href={data.backHref} use:back>{$LL.back()}</a>
</div>

<style lang="scss">
  .container {
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .header-image {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      img {
        max-height: 20vh;
        border-radius: 4px;
      }
    }

    .images-box {
      text-align: center;
      .images {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(auto-fit, minmax(140px, auto));
        margin: 0 0 16px;
        .img-box {
          display: flex;
          flex-direction: column;
          img {
            margin: auto;
            max-height: 140px;
            object-fit: contain;
            border-radius: 4px;
          }
          button {
            width: fit-content;
            margin: 4px auto 0;
          }
        }
      }

      .desc {
        font-size: 14px;
        font-style: italic;
        margin: 8px 0 0 0;
      }
    }

    .preview-btn,
    .back-btn {
      margin: 16px auto 0;
    }
  }
</style>
