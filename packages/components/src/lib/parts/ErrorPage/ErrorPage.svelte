<script lang="ts">
  import { LL } from '@announcing/i18n';

  interface Props {
    status?: number;
    message?: string;
  }

  let { status, message }: Props = $props();
  let desc = $derived.by(() => {
    if (message) {
      return message;
    }
    if (status === 404) {
      return $LL.pageNotFound();
    }
    return $LL.errorApologize();
  });
</script>

<div class="container">
  <div class="desc">{desc}</div>
  {#if status}
    <div class="status">({status})</div>
  {/if}
</div>

<style lang="scss">
  .container {
    margin: 30dvh 32px 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    color: var(--color-text-subtle);
  }
  .desc {
    white-space: pre-wrap;
  }
</style>
