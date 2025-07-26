<script lang="ts">
  import TextArea from '$lib/atoms/TextArea.svelte';

  let required = $state(false);
</script>

<div class="container">
  <TextArea name="test" label="Description" {required} />

  <label class="required">
    <input type="checkbox" bind:checked={required} />
    <span>Required</span>
  </label>
</div>

<style lang="scss">
  .container {
    margin: 0 auto;
    padding: 30vh 16px;
    max-width: 400px;

    .required {
      margin-top: 16px;
      display: flex;
    }
  }
</style>
