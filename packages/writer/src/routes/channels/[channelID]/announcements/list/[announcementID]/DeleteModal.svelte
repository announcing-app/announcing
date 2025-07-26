<script lang="ts">
  import Loading from '@announcing/components/Loading.svelte';
  import Modal from '@announcing/components/Modal.svelte';
  import { LL } from '@announcing/i18n';

  interface Props {
    onSubmit: () => Promise<void>;
  }

  let { onSubmit }: Props = $props();

  export const openModal = () => {
    deleteUnderstand = false;
    open = true;
    loading = false;
  };

  let open = $state(false);
  let deleteUnderstand = $state(false);
  let loading = $state(false);

  const submitHandler = async () => {
    loading = true;
    try {
      await onSubmit();
      open = false;
    } finally {
      loading = false;
    }
  };
</script>

<Modal bind:open dismissMode="backdrop">
  <div class="delete-modal">
    <span class="title">{$LL.deleteAnnouncement()}</span>
    <div class="warning">{$LL.deleteAnnouncementDesc()}</div>
    <label class="understand-box">
      <input type="checkbox" bind:checked={deleteUnderstand} />
      {$LL.understand()}
    </label>

    <button class="delete-btn" disabled={!deleteUnderstand} onclick={submitHandler}>
      {$LL.deleteAnnouncement()}
    </button>

    <button
      class="small filled"
      onclick={() => {
        open = false;
      }}>{$LL.cancel()}</button
    >
  </div>
</Modal>

<Loading show={loading} />

<style lang="scss">
  .delete-modal {
    background-color: var(--color-background);
    border-radius: 16px;
    margin: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;

    .title {
      font-size: 20px;
      color: var(--color-text-subtle);
    }

    .warning {
      font-weight: bold;
      font-size: 18px;
      color: var(--color-error);
      padding: 0 8px;
    }
  }
</style>
