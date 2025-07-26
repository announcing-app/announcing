<script lang="ts" module>
  export type DismissMode = 'backdrop' | 'anywhere' | 'none';
</script>

<script lang="ts">
  import { type Snippet } from 'svelte';

  import { toStyle } from '$lib/utils/toStyle';

  interface Props {
    dismissMode?: 'backdrop' | 'anywhere' | 'none';
    padding?: string;
    open?: boolean;
    onDismiss?: () => void;
    children?: Snippet;
  }

  let {
    dismissMode = 'backdrop',
    padding = '8px',
    open = $bindable(false),
    onDismiss,
    children,
  }: Props = $props();

  const clickHandler = (event: MouseEvent) => {
    if (dismissMode === 'anywhere') {
      open = false;
      onDismiss?.();
    } else if (dismissMode === 'backdrop' && event.target === event.currentTarget) {
      open = false;
      onDismiss?.();
    }
  };
</script>

<div
  role="button"
  tabindex="0"
  class="modal"
  class:open
  style={toStyle({ display: open ? undefined : 'none', padding })}
  onclick={clickHandler}
  onkeydown={() => {
    // TODO
  }}
>
  {@render children?.()}
</div>

<svelte:window
  onkeydown={(event) => {
    if (event.key === 'Escape') {
      open = false;
      onDismiss?.();
    }
  }}
/>

<style lang="scss">
  :global(body:has(.modal.open)) {
    overflow: hidden;
  }

  .modal {
    cursor: default;
    display: flex;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    background-color: var(--color-background-modal);
    z-index: var(--modal-z-index, 999);
  }
</style>
