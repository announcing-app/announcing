<script lang="ts">
  import { page } from '$app/state';
  import VirtualScrollList from '$lib/atoms/VirtualScrollList.svelte';
  import { createSnapshotContext } from '$lib/utils/snapshotContext.js';
  import { items } from './items';

  export const snapshot = createSnapshotContext();

  const keys = [...items.keys()];
</script>

<div class="container">
  <div class="forward-box">
    <a href={`${page.url.href}/back`}>Forward</a>
  </div>
  <VirtualScrollList {keys} itemMinHeight={100}>
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

    .forward-box {
      top: 0px;
      position: sticky;
      margin: 0 0 8px 0;
      background-color: var(--color-background-light);
      padding: 8px;
    }

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
