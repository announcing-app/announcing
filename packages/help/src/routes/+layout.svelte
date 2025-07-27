<script lang="ts">
  import { page } from '$app/state';
  import RootLayout from '@announcing/components/RootLayout.svelte';
  import { type Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  let lang = $derived(page.url.pathname.split('/')[1] ?? '');
</script>

<header>
  <a href={`/${lang}`} class="title">Announcing Help</a>
  <svelte:element this={lang === 'en' ? 'span' : 'a'} href="/en">English</svelte:element>
  <svelte:element this={lang === 'ja' ? 'span' : 'a'} href="/ja">日本語</svelte:element>
</header>

<RootLayout>
  {@render children?.()}
</RootLayout>

<style lang="scss">
  header {
    padding: 16px;
    color: var(--color-text-subtle);
    display: flex;
    align-items: center;
    gap: 8px;

    .title {
      margin-right: auto;
      font-size: 18px;
    }

    a,
    span {
      font-size: 14px;
    }

    span {
      font-weight: bold;
    }
  }
</style>
