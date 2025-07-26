<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import MaterialSymbolsSettingsOutline from '$lib/icons/MaterialSymbolsSettingsOutline.svelte';
  import SettingsModal from '$lib/parts/SettingsModal/SettingsModal.svelte';
  import type { Themes } from '$lib/utils/settings';
  import { LL, type Locales } from '@announcing/i18n';
  import { tick, type Component } from 'svelte';

  type Item =
    | {
        type: 'link';
        label: string;
        icon: Component;
        href: string;
      }
    | {
        type: 'button';
        label: string;
        icon: Component;
        onclick: () => void;
      }
    | {
        type: 'settings';
      };

  interface Props {
    items: Item[];
    requestLocale: Locales;
    requestTheme: Themes | undefined;
  }

  let { items, requestLocale, requestTheme }: Props = $props();
  let hidden = $state(false);
  let toolbarSize = $state('');

  let previousScrollY = -1;
  let settingsModal: SettingsModal;

  afterNavigate(() => {
    tick()
      .then(() => {
        /**
         VirtualScrollList used in ChanelView restores scrollY, so reset it.
        */
        previousScrollY = -1;
        hidden = false;
      })
      .catch(() => {
        //
      });
  });

  const onScrollHandler = () => {
    if (previousScrollY < 0) {
      previousScrollY = window.screenY;
      return;
    }

    const currentY = window.scrollY;

    /**
     Hide the toolbar when scrolling down, and restore it when scrolling up.
     Make it slightly insensitive when hiding.
    */
    if (currentY > previousScrollY && currentY - previousScrollY > 10) {
      hidden = true;
    } else if (currentY < previousScrollY && previousScrollY - currentY) {
      hidden = false;
    }

    previousScrollY = currentY;
  };
</script>

<svelte:window onscroll={onScrollHandler} />

<div class="toolbar" class:hidden class:compact={toolbarSize === 'compact'}>
  {#each items as item, i (i)}
    {#if item.type === 'link'}
      <a href={item.href}><item.icon /><span>{item.label}</span></a>
    {:else if item.type === 'button'}
      <button class="unstyled" onclick={item.onclick}><item.icon /><span>{item.label}</span></button
      >
    {:else}
      <button
        class="unstyled"
        onclick={() => {
          settingsModal.openModal();
        }}><MaterialSymbolsSettingsOutline /><span>{$LL.settings()}</span></button
      >
    {/if}
  {/each}
</div>

<SettingsModal bind:this={settingsModal} {requestLocale} {requestTheme} bind:toolbarSize />

<style lang="scss">
  .toolbar {
    margin-top: auto;
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;

    background-color: var(--color-background);
    border-top: 1px solid var(--color-border);
    transition: transform 0.2s ease;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));

    &.hidden {
      transform: translateY(100%);
    }

    a,
    button {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 0;
      margin: 0 auto;
      font-size: 24px;

      span {
        font-size: 13px;
      }
    }

    &.compact {
      a,
      button {
        font-size: 28px;
        span {
          display: none;
        }
      }
    }

    @media (min-width: 800px) {
      position: fixed;
      top: 0;
      left: calc((100dvw - 600px) / 2 - 80px);
      right: unset;
      bottom: 0;
      width: 70px;
      margin: 64px 0 0;
      border-top: unset;
      display: flex;
      flex-direction: column;
      gap: 32px;
      &.hidden {
        transform: unset;
      }
    }
  }
</style>
