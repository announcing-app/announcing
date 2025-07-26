<script lang="ts">
  import VirtualScrollList from '$lib/atoms/VirtualScrollList.svelte';
  import { toStyle } from '$lib/utils/toStyle';

  const keys = [...Array(20)].map((_, index) => {
    return index;
  });

  const expands: Record<number, boolean> = $state({});
</script>

<div class="container">
  <VirtualScrollList {keys} itemMinHeight={100}>
    {#snippet itemSnippet(key)}
      <div
        class="item"
        style={toStyle({ height: `${expands[key] ? 200 : 100}px` })}
        role="button"
        tabindex="0"
        onclick={() => {
          expands[key] = !expands[key];
        }}
        onkeydown={() => {
          //
        }}
      >
        <div>
          {key}
          {expands[key] ? 'expand' : 'not expand'}
        </div>
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
      cursor: pointer;
      div {
        margin: auto;
      }
    }
  }
</style>
