<script lang="ts">
  import '../app.scss';

  import { page } from '$app/state';
  import { MdiGithub } from '@announcing/components/icons';
  import RootLayout from '@announcing/components/RootLayout.svelte';
  import { type Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  let lang = $derived(page.url.pathname.split('/')[1] ?? '');
</script>

<svelte:head>
  <title>Announcing Help</title>
</svelte:head>

<header>
  <a href={`/${lang}`} class="title">Announcing Help</a>
  <svelte:element this={lang === 'en' ? 'span' : 'a'} href="/en">English</svelte:element>
  <svelte:element this={lang === 'ja' ? 'span' : 'a'} href="/ja">日本語</svelte:element>
</header>

<RootLayout>
  {@render children?.()}
</RootLayout>

<footer>
  <a href="https://github.com/announcing-app/announcing" class="github"><MdiGithub /></a>
</footer>

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
      text-decoration: none;
    }

    a,
    span {
      font-size: 14px;
    }

    span {
      font-weight: bold;
    }
  }

  footer {
    margin: auto 0 16px;
    padding-top: 64px;
    text-align: center;
    .github {
      font-size: 32px;
    }
  }
</style>
