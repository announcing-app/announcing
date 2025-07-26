<script lang="ts">
  import FileInput from '$lib/atoms/FileInput.svelte';
  import { tick } from 'svelte';

  let fileInput = $state<ReturnType<typeof FileInput>>();
  let values: string[] | undefined = $state();
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
    filesCount={4}
    onInputs={async (blobs) => {
      values = blobs.map((blob) => {
        return URL.createObjectURL(blob);
      });
      try {
        await tick();
      } finally {
        values.forEach((value) => {
          URL.revokeObjectURL(value);
        });
      }
    }}
  />

  {#if values}
    <div class="images">
      {#each values as value (value)}
        <button
          class="unstyled"
          onclick={() => {
            values = values?.filter((v) => v !== value);
          }}
        >
          <img alt={value} src={value} />
        </button>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .container {
    text-align: center;
    padding: 30vh;

    .images {
      margin: 20px 0;
      display: flex;
      gap: 16px;
      justify-content: center;
      img {
        max-height: 100px;
      }
    }
  }
</style>
