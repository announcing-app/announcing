<script lang="ts">
  import Modal, { type DismissMode } from '$lib/atoms/Modal.svelte';

  let open = $state(false);
  let dismissMode = $state<DismissMode>('backdrop');
</script>

<div class="container">
  <button
    onclick={() => {
      dismissMode = 'backdrop';
      open = true;
    }}>Open(backdrop)</button
  >
  <button
    onclick={() => {
      dismissMode = 'anywhere';
      open = true;
    }}>Open(anywhere)</button
  >
  <button
    onclick={() => {
      dismissMode = 'none';
      open = true;
    }}>Open(none)</button
  >
</div>
<Modal bind:open {dismissMode}>
  <div class="modal-body">
    <div>
      This is a test modal for verifying the component’s functionality. Please review the layout and
      interactions. Close the modal when you’re done.
    </div>
    <button
      onclick={() => {
        open = false;
      }}>Close</button
    >
  </div>
</Modal>

<style lang="scss">
  .container {
    text-align: center;
    padding: 30vh 0;
  }

  .modal-body {
    background-color: var(--color-background);
    border-radius: 16px;
    margin: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    max-width: 600px;
  }
</style>
