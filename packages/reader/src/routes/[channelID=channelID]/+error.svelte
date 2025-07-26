<script lang="ts">
  import { page } from '$app/stores';

  let status = $derived($page.status);
</script>

{#if status === 404}
  チャンネルが存在しません
{/if}

{#if status !== 404}
  チャンネルの読込中にエラーが発生しました
{/if}
