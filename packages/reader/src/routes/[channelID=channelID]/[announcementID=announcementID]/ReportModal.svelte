<script lang="ts">
  import Modal from '@announcing/components/Modal.svelte';
  import { LL } from '@announcing/i18n';

  let open = $state(false);
  let details = $state('');
  let callback: (details: string) => Promise<void>;

  export const openModal = (cb: typeof callback) => {
    callback = cb;
    open = true;
  };
</script>

<Modal bind:open dismissMode="none">
  <div class="modal-body">
    <div class="message">{$LL.reportDesc()}</div>
    <textarea bind:value={details}></textarea>
    <button
      class="small"
      onclick={async () => {
        await callback(details);
        open = false;
      }}
      disabled={!details}>{$LL.submit()}</button
    >
    <button
      class="cancel-btn small"
      onclick={() => {
        open = false;
      }}>{$LL.cancel()}</button
    >
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
</style>
