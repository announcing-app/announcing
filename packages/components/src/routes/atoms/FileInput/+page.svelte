<script lang="ts">
  import FileInput from '$lib/atoms/FileInput.svelte';
  import { tick } from 'svelte';

  let fileInput = $state<ReturnType<typeof FileInput>>();

  let value: string | undefined = $state();
</script>

<div class="container">
  <button
    onclick={() => {
      fileInput?.open();
    }}>Open</button
  >

  <FileInput
    bind:this={fileInput}
    accept="image/*"
    onInput={async (blob) => {
      value = URL.createObjectURL(blob);
      try {
        await tick();
      } finally {
        URL.revokeObjectURL(value);
      }
    }}
  />

  {#if value}
    <div>
      <img alt="" src={value} />
    </div>
    <div>
      {value}
    </div>
  {/if}
</div>

<style lang="scss">
  .container {
    text-align: center;
    padding: 30vh;

    img {
      margin: 20px 0;
    }
  }
</style>
