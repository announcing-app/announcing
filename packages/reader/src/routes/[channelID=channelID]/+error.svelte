<script lang="ts">
  import { page } from '$app/state';
  import ErrorPage from '@announcing/components/ErrorPage.svelte';
  import { LL } from '@announcing/i18n';

  let status = $derived(page.status);
</script>

{#if status === 404}
  <ErrorPage {status} message={$LL.channelNotFound()} />
{/if}

{#if status !== 404}
  <ErrorPage {status} />
{/if}
