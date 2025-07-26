<script lang="ts">
  import Loading from '$lib/atoms/Loading.svelte';

  let show = $state(false);
</script>

<div class="container">
  <button
    onclick={(event) => {
      show = true;
      event.stopPropagation();
    }}>Show</button
  >
</div>

<Loading {show} />

<svelte:body
  onclick={() => {
    show = false;
  }}
/>

<style lang="scss">
  .container {
    text-align: center;
    padding: 30vh 16px;
  }
</style>
