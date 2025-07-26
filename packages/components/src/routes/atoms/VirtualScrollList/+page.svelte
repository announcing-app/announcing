<script lang="ts">
  import VirtualScrollList from '$lib/atoms/VirtualScrollList.svelte';
  import { toStyle } from '$lib/utils/toStyle';

  const keys = [...Array(20)].map((_, index) => {
    return index.toString();
  });
</script>

<div class="container">
  <VirtualScrollList {keys} itemMinHeight={100}>
    {#snippet itemSnippet(key: string)}
      <div class="item" style={toStyle({ height: `${100 + +key * 10}px` })}>
        <div>{key}</div>
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
      border: 1px solid black;
      display: flex;
      div {
        margin: auto;
      }
    }
  }
</style>
