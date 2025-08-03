<script lang="ts">
  import { stripStoragePath } from '$lib/db/resolver';
  import FileInput from '@announcing/components/FileInput.svelte';
  import Input from '@announcing/components/Input.svelte';
  import Loading from '@announcing/components/Loading.svelte';
  import Modal from '@announcing/components/Modal.svelte';
  import TextArea from '@announcing/components/TextArea.svelte';
  import {
    CHANNEL_DESC_MAX_BYTES,
    CHANNEL_ICON_MAX_SIZE,
    CHANNEL_NAME_MAX_BYTES,
  } from '@announcing/db/constants';
  import { LL } from '@announcing/i18n';
  import { tick } from 'svelte';

  interface Props {
    onSubmit: (formData: FormData) => Promise<void>;
  }

  let { onSubmit }: Props = $props();

  let open = $state(false);
  let loading = $state(false);
  let creating = $state(false);
  let form = $state<{
    name?: string;
    desc?: string | undefined;
    icon?: string | undefined;
    iconBlob?: Blob | undefined;
  }>({});
  let nameError = $state(false);
  let descError = $state(false);
  let validated = $derived(!!form.name && !nameError && !descError);

  let fileInput: ReturnType<typeof FileInput>;

  export const openEditor = (channel?: {
    name: string;
    desc: string | undefined;
    icon: string | undefined;
  }) => {
    form = { ...channel };
    creating = !channel;
    open = true;
  };

  const iconFileInputHandler = async (iconBlob: Blob) => {
    const icon = URL.createObjectURL(iconBlob);

    try {
      form = { ...form, icon, iconBlob };
      await tick();
    } finally {
      URL.revokeObjectURL(icon);
    }
  };

  const submitClickHandler = async () => {
    const formData = new FormData();
    if (form.name) formData.append('name', form.name);
    if (form.desc) formData.append('desc', form.desc);
    if (form.icon) {
      const blob = form.iconBlob;
      if (blob) {
        formData.append('icon', blob);
      } else {
        formData.append('icon', stripStoragePath(form.icon));
      }
    }

    loading = true;
    try {
      await onSubmit(formData);
      open = false;
    } finally {
      loading = false;
    }
  };
</script>

<Modal bind:open dismissMode="none">
  <div class="modal-body">
    <div class="name-box">
      <div class="input-box">
        <Input
          name="name"
          label={$LL.channelName()}
          bind:value={form.name}
          maxBytes={CHANNEL_NAME_MAX_BYTES}
          required
          bind:error={nameError}
        />
      </div>
      <div class="icon-box">
        {#if form.icon}
          <button
            class="unstyled"
            onclick={() => {
              fileInput.open();
            }}
          >
            {#if form.icon}
              <img class="icon" alt="icon preview" src={form.icon} />
            {/if}
          </button>
          <button
            type="button"
            class="icon-remove"
            onclick={() => {
              form.icon = undefined;
            }}>{$LL.remove()}</button
          >
        {:else}
          <button
            class="icon-select"
            onclick={() => {
              fileInput.open();
            }}>{$LL.selectIcon()}</button
          >
        {/if}
        <FileInput
          accept="image/jpeg,image/png,image/webp"
          maxImageSize={CHANNEL_ICON_MAX_SIZE}
          bind:this={fileInput}
          onInput={iconFileInputHandler}
        />
      </div>
    </div>
    <TextArea
      name="desc"
      label={$LL.desc()}
      bind:value={form.desc}
      maxBytes={CHANNEL_DESC_MAX_BYTES}
      maxHeight="40vh"
      bind:error={descError}
    />
    <button disabled={!validated} class="submit-btn" onclick={submitClickHandler}
      >{creating ? $LL.createChannel() : $LL.updateChannel()}</button
    >
    <button
      class="small filled cancel-btn"
      onclick={() => {
        open = false;
      }}>{$LL.cancel()}</button
    >
  </div>
</Modal>

<Loading show={loading} />

<style lang="scss">
  .modal-body {
    background-color: var(--color-background);
    border-radius: 16px;
    width: 100%;
    max-width: 600px;
    margin: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .name-box {
      display: flex;
      align-items: center;

      .input-box {
        flex-grow: 1;
        margin: 0 8px 0 0;
      }

      .icon-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        button.icon-select {
          width: 64px;
          height: 64px;
          white-space: normal;
          font-size: 12px;
          padding: 0;
          white-space: pre-wrap;
          :global(:has(#settings[data-locale='ja'])) & {
            font-size: 10px;
          }
        }
        button.icon-remove {
          font-size: 12px;
          padding: 4px;
          width: 64px;
          :global(:has(#settings[data-locale='ja'])) & {
            font-size: 11px;
          }
        }
        .icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          object-fit: contain;
        }
      }
    }

    .submit-btn {
      align-self: center;
    }

    .cancel-btn {
      align-self: center;
    }
  }
</style>
