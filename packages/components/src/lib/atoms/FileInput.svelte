<script lang="ts">
  import reduce from 'image-blob-reduce';

  import Loading from './Loading.svelte';

  interface Props {
    accept?: string | undefined;
    maxImageSize?: number | undefined;
    filesCount?: number;
    onInput?: (blob: Blob) => void | Promise<void>;
    onInputs?: (blobs: Blob[]) => void | Promise<void>;
  }

  let {
    accept = undefined,
    maxImageSize = undefined,
    filesCount = 1,
    onInput,
    onInputs,
  }: Props = $props();

  let loading = $state(false);
  let fileInput: HTMLInputElement;

  export const open = () => {
    fileInput.click();
  };

  const fileInputChange = async () => {
    const selectedFiles = fileInput.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    loading = true;

    const blobs: Blob[] = [];

    try {
      for (let i = 0; i < filesCount; i++) {
        const f = selectedFiles.item(i);

        if (!f) break;

        if (!maxImageSize) {
          blobs.push(f);
          continue;
        }

        const reducer = reduce();

        const reduced = await reducer.toBlob(f, {
          max: maxImageSize,
          unsharpAmount: 160,
          unsharpRadius: 0.6,
          unsharpThreshold: 1,
        });

        blobs.push(reduced);
      }

      if (onInput) {
        const blob = blobs[0];
        if (blob) {
          await onInput(blob);
        }
      }
      if (onInputs) {
        await onInputs(blobs);
      }
    } finally {
      fileInput.value = '';
      loading = false;
    }
  };
</script>

<input
  type="file"
  {accept}
  multiple={filesCount > 1}
  style="display:none"
  bind:this={fileInput}
  onchange={fileInputChange}
/>

{#if loading}
  <Loading show={true} />
{/if}
