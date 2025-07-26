<script lang="ts">
  import { page } from '$app/state';
  import { back } from '$lib/actions/back';

  let id = $derived(+(page.params['id'] ?? '0'));
</script>

<div class="container">
  <div class="current">{id}</div>
  <div class="links">
    {#if id > 0}
      <a href={`/actions/back/${id - 1}`} use:back>Back to {id - 1}</a>
    {:else}
      <a href="/" use:back>Back to Top</a>
    {/if}
    <a href={`/actions/back/${id + 1}`}>Forward to {id + 1}</a>
  </div>
</div>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 100px auto;
    text-align: center;

    .current {
      font-size: 24px;
      margin-bottom: 64px;
    }

    .links {
      display: flex;
      gap: 36px;
      justify-content: center;
    }
  }
</style>
