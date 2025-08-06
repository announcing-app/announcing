<script lang="ts" generics="T extends string | number">
  import { createResizeObserverHelper } from '$lib/utils/resizeObserverHelper';
  import { addSnapShot } from '$lib/utils/snapshotContext';
  import { toStyle } from '$lib/utils/toStyle';
  import { onMount, tick, type Snippet } from 'svelte';

  interface Props {
    keys: T[];
    itemMinHeight: number;
    gap?: number;
    overScanCount?: number;
    itemSnippet: Snippet<[T]>;
  }

  let { keys, itemMinHeight, gap = 0, overScanCount = 2, itemSnippet }: Props = $props();

  let itemsRect = $state<DOMRect>();
  let heightMap = $state({} as Record<T, number>);
  let itemsElement: HTMLDivElement;

  let visibleState = $derived.by<{
    topHeight: number;
    totalHeight: number;
    visibleKeys: T[];
  }>(() => {
    if (!itemsRect) {
      return { topHeight: 0, totalHeight: 0, visibleKeys: [] };
    }

    const itemsY = Math.max(0, itemsRect.y * -1);
    const visibleBottomY = itemsY + document.documentElement.clientHeight;

    const getItemHeight = (key: T) => {
      return heightMap[key] ?? itemMinHeight;
    };
    const startRow = (() => {
      let sumHeight = 0;
      for (const [i, key] of keys.entries()) {
        sumHeight += getItemHeight(key) + gap;
        if (sumHeight > itemsY) {
          return Math.max(0, i - overScanCount);
        }
      }
      return 0;
    })();

    const topHeight = keys.slice(0, startRow).reduce((p, v) => {
      return p + getItemHeight(v) + gap;
    }, 0);

    const endRow = (() => {
      let sumHeight = topHeight;
      for (const [i, item] of keys.slice(startRow).entries()) {
        sumHeight += getItemHeight(item) + gap;
        if (sumHeight >= visibleBottomY) {
          return i + startRow + overScanCount;
        }
      }
      return keys.length - 1;
    })();

    const totalHeight = Math.ceil(
      keys.reduce((p, v) => {
        return p + getItemHeight(v);
      }, 0) +
        (keys.length - 1) * gap,
    );

    const visibleKeys = keys.slice(startRow, endRow + 1);
    return {
      topHeight,
      totalHeight,
      visibleKeys,
    };
  });

  const updateItemsRect = () => {
    itemsRect = itemsElement.getBoundingClientRect();
  };

  onMount(() => {
    const resizeObserver = createResizeObserverHelper(updateItemsRect);
    resizeObserver.observe(itemsElement);

    return () => {
      resizeObserver.disconnect();
    };
  });

  type ElementWithItem = Element & { key?: T };

  const itemResize = (() => {
    const itemResizeHelper = createResizeObserverHelper((entry) => {
      const key = (entry.target as ElementWithItem).key;
      if (key) {
        if (heightMap[key] !== entry.contentRect.height) {
          heightMap[key] = entry.contentRect.height;
        }
      }
    });

    onMount(() => {
      return () => {
        itemResizeHelper.disconnect();
      };
    });

    const action = (el: ElementWithItem, key: T) => {
      el.key = key;
      itemResizeHelper.observe(el);

      return {
        update: (key: T) => {
          el.key = key;
        },
        destroy: () => {
          itemResizeHelper.unobserve(el);
        },
      };
    };

    return action;
  })();

  type SnapShotData = {
    heightMap: Record<string | number, number>;
    scrollY: number;
  };

  addSnapShot({
    capture: (): SnapShotData => {
      const data = { heightMap, scrollY: window.scrollY };
      return data;
    },
    restore: (data) => {
      updateItemsRect();
      if ('heightMap' in data) {
        heightMap = data.heightMap;
      }
      if ('scrollY' in data) {
        tick()
          .then(() => {
            window.scrollTo({ top: data.scrollY });
          })
          .catch(() => {
            //
          });
      }
    },
  });
</script>

<svelte:document on:scroll={updateItemsRect} />

<div
  bind:this={itemsElement}
  class="items"
  style={toStyle({
    'height': `${visibleState.totalHeight}px`,
    'gap': `${gap}px`,
    'padding-top': `${visibleState.topHeight}px`,
  })}
>
  {#if visibleState.visibleKeys}
    {#each visibleState.visibleKeys as key (key)}
      <div class="item-box" use:itemResize={key}>
        {@render itemSnippet(key)}
      </div>
    {/each}
  {/if}
</div>

<style lang="scss">
  .items {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
