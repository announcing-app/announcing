<script lang="ts">
  import Modal from '@announcing/components/Modal.svelte';
  import { LL } from '@announcing/i18n';

  type OpenParams = {
    onOK: (() => void) | (() => Promise<void>);
    message: string;
  };

  let open = $state(false);
  let params = $state<OpenParams>();

  export const openModal = (p: OpenParams) => {
    open = true;
    params = p;
  };
</script>

<Modal bind:open dismissMode="backdrop">
  <div class="modal-body">
    <div class="message">
      {params?.message}
    </div>
    <div class="buttons">
      <button
        class="small"
        onclick={async () => {
          await params?.onOK();
          open = false;
        }}>{$LL.yes()}</button
      >
      <button
        class="cancel-btn small"
        onclick={() => {
          open = false;
        }}>{$LL.no()}</button
      >
    </div>
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

    .buttons {
      display: flex;
      width: 100%;
      justify-content: space-around;
      button {
        width: 100px;
      }
    }
  }
</style>
