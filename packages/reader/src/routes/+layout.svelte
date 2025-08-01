<script lang="ts">
  import { PUBLIC_HELP_PREFIX } from '$env/static/public';
  import { isPWA } from '$lib/platform/platform';
  import {
    F7SquareFavorites,
    MaterialSymbolsHelpOutlineRounded,
    MdiReload,
  } from '@announcing/components/icons';
  import RootLayout from '@announcing/components/RootLayout.svelte';
  import Toolbar from '@announcing/components/Toolbar.svelte';
  import { LL, locale } from '@announcing/i18n';
  import { onMount, type ComponentProps, type Snippet } from 'svelte';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }

  let { data, children }: Props = $props();
  let pwa = $state(false);
  let toolbarItems = $derived.by(() => {
    const items: ComponentProps<typeof Toolbar>['items'] = [];
    if (!pwa) {
      items.push({
        type: 'link',
        label: $LL.favorites(),
        icon: F7SquareFavorites,
        href: '/favorites',
      });
    }
    items.push(
      {
        type: 'button',
        label: $LL.reload(),
        icon: MdiReload,
        onclick: () => {
          location.reload();
        },
      },
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

  onMount(() => {
    pwa = isPWA();
  });
</script>

<RootLayout>
  {@render children?.()}
</RootLayout>

<Toolbar requestLocale={data.requestLocale} requestTheme={data.requestTheme} items={toolbarItems} />
