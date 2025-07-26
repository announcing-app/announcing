<script lang="ts">
  import { LL } from '@announcing/i18n';

  interface Props {
    name: string;
    label: string;
    value?: string | undefined;
    maxBytes?: number;
    error?: boolean;
    required?: boolean;
  }

  let {
    name,
    label,
    value = $bindable(undefined),
    maxBytes = 0,
    error = $bindable(false),
    required = false,
  }: Props = $props();

  const encoder = new TextEncoder();

  let bytes = $derived(encoder.encode(value).length);

  $effect(() => {
    error = maxBytes > 0 && bytes > maxBytes;
  });
</script>

<label>
  <div class="label-box">
    <span class="label">{label}</span>
    {#if required}
      <span class="required">{$LL.required()}</span>
    {/if}
  </div>
  <input {name} bind:value />

  {#if error}
    <div class="error">
      {$LL.textTooLong()}
    </div>
  {/if}
</label>

<style lang="scss">
  label {
    display: flex;
    flex-direction: column;
  }
  .label-box {
    display: flex;
    align-items: center;

    .required {
      font-size: 12px;
      color: var(--color-text-light);
      margin: 0 0 0 4px;
    }
  }

  input {
    margin-top: 4px;
  }

  label:focus-within {
    .label,
    .required {
      font-weight: 500;
    }
  }

  .error {
    margin: 4px 0 0 4px;
  }
</style>
