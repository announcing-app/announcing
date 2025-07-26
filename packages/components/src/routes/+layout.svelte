<script lang="ts">
  import MaterialSymbolsHomeOutlineRounded from '$lib/icons/MaterialSymbolsHomeOutlineRounded.svelte';
  import RootLayout from '$lib/parts/RootLayout/RootLayout.svelte';
  import Toolbar from '$lib/parts/Toolbar/Toolbar.svelte';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: import('svelte').Snippet;
  }

  let { data, children }: Props = $props();
</script>

<RootLayout>
  {@render children?.()}
</RootLayout>

<Toolbar
  requestLocale={data.requestLocale}
  requestTheme={data.requestTheme}
  items={[
    { type: 'link', label: 'Home', href: '/', icon: MaterialSymbolsHomeOutlineRounded },
    { type: 'settings' },
  ]}
/>
