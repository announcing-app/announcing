<script lang="ts">
  import Modal from '@announcing/components/Modal.svelte';
  import { LL } from '@announcing/i18n';
  import { fade } from 'svelte/transition';

  let open = $state(false);
  let copied: undefined | 'copied' | 'error' = $state(undefined);
  let value = $state('');

  export const openModal = (v: string) => {
    open = true;
    value = v;
    copied = undefined;
  };

  const onFocus = (event: FocusEvent) => {
    (event.target as HTMLInputElement).select();
  };
</script>

<Modal bind:open dismissMode="backdrop">
  <div class="modal-body">
    {#if copied}
      <div
        class="msg-box"
        in:fade={{ duration: 1000 }}
        onintroend={() => {
          open = false;
        }}
      >
        {copied === 'copied' ? $LL.copied() : $LL.copyError()}
      </div>
    {:else}
      <div class="copy-box">
        <input {value} readonly onfocus={onFocus} />
        <button
          class="small"
          onclick={() => {
            navigator.clipboard
              .writeText(value)
              .then(() => {
                copied = 'copied';
              })
              .catch(() => {
                copied = 'error';
              });
          }}>{$LL.copy()}</button
        >
      </div>
      <button
        class="close-btn filled small"
        onclick={() => {
          open = false;
        }}>{$LL.close()}</button
      >
    {/if}
  </div>
</Modal>

<style lang="scss">
  .modal-body {
    background-color: var(--color-background);
    border-radius: 16px;
    margin: auto;
    padding: 32px 16px;
    width: 100%;
    max-width: 400px;

    .copy-box {
      display: flex;
      input {
        width: auto;
        flex-grow: 1;
        text-align: center;
        border-radius: 16px 0 0 16px;
      }
      button {
        border-radius: 0 16px 16px 0;
      }
    }
    .msg-box {
      text-align: center;
    }
    .close-btn {
      display: block;
      margin: 32px auto 0;
    }
  }
</style>
