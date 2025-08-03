<script lang="ts">
  import { page } from '$app/state';
  import ErrorPage from '@announcing/components/ErrorPage.svelte';
  import { LL } from '@announcing/i18n';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  let status = $derived(page.status);
  let message = $derived(page.error?.message);
</script>

{#if status === 404}
  {#if message === 'channel'}
    <ErrorPage {status} message={$LL.channelNotFound()} />
  {:else}
    <ErrorPage {status} message={$LL.announcementNotFound()} />

    <a class="button small" href={`/${data.channelID}`}>{$LL.back()}</a>
  {/if}
{:else}
  <ErrorPage {status} />
{/if}

<style lang="scss">
  a {
    margin: 32px auto 0;
  }
</style>
