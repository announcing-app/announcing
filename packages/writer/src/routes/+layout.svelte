<script lang="ts">
  import { page } from '$app/state';
  import { PUBLIC_HELP_PREFIX } from '$env/static/public';
  import {
    MaterialSymbolsHelpOutlineRounded,
    MaterialSymbolsHomeOutlineRounded,
  } from '@announcing/components/icons';
  import RootLayout from '@announcing/components/RootLayout.svelte';
  import Toolbar from '@announcing/components/Toolbar.svelte';
  import { LL, locale } from '@announcing/i18n';
  import { type ComponentProps, type Snippet } from 'svelte';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }

  let { data, children }: Props = $props();

  let toolbarItems = $derived.by(() => {
    const items: ComponentProps<typeof Toolbar>['items'] = [];
    if (!page.url.pathname.startsWith('/signin')) {
      items.push({
        type: 'link',
        label: $LL.home(),
        icon: MaterialSymbolsHomeOutlineRounded,
        href: '/',
      });
    }
    items.push(
      { type: 'settings' },
      {
        type: 'link',
        href: `${PUBLIC_HELP_PREFIX}/${$locale}`,
        icon: MaterialSymbolsHelpOutlineRounded,
        label: $LL.help(),
      },
    );
    return items;
  });
</script>

<svelte:head>
  <title>{$LL.writerTitle()}</title>
</svelte:head>

<RootLayout>
  {@render children?.()}
</RootLayout>

<div class="bottom"></div>

<Toolbar requestLocale={data.requestLocale} requestTheme={data.requestTheme} items={toolbarItems} />

<style lang="scss">
  .bottom {
    height: 64px;
  }
</style>
