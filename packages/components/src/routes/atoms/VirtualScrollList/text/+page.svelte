<script lang="ts">
  import VirtualScrollList from '$lib/atoms/VirtualScrollList.svelte';

  import { items } from './items';

  const keys = [...items.keys()];
</script>

<div class="container">
  <VirtualScrollList {keys} itemMinHeight={100} overScanCount={2} gap={0}>
    {#snippet itemSnippet(key)}
      <div class="item">
        <div class="title">{items.get(key)?.title}</div>
        <div class="body">{items.get(key)?.body}</div>
        <hr />
      </div>
    {/snippet}
  </VirtualScrollList>
</div>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 8px;

    .item {
      overflow: hidden;
      .title {
        margin: 0 0 8px;
        font-weight: bold;
        font-size: 18px;
      }
      .body {
        white-space: pre-wrap;
        line-height: 1.5;
      }
      hr {
        margin: 8px 0;
      }
    }
  }
</style>
