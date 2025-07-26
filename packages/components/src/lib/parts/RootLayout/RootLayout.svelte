<script lang="ts">
  import '../../base.scss';

  import { navigating, page } from '$app/state';
  import { setupBack } from '$lib/actions/back';
  import Navigating from '$lib/atoms/Navigating.svelte';
  import { onMount, type Snippet } from 'svelte';
  import { fade } from 'svelte/transition';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  onMount(() => {
    document.documentElement.setAttribute('hydrated', '');
  });

  setupBack();
</script>

<Navigating show={!!navigating.from} />

{#key page.url.pathname}
  <main in:fade>
    {@render children?.()}
  </main>
{/key}

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
  }
</style>
