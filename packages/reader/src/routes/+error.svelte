<script lang="ts">
  import { page } from '$app/state';
  import ErrorPage from '@announcing/components/ErrorPage.svelte';

  let status = $derived(page.status);
</script>

<ErrorPage {status} />
