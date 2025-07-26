<script lang="ts">
  import Input from '$lib/atoms/Input.svelte';

  let required = $state(false);
</script>

<div class="container">
  <Input name="test" label="Name" {required} />

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
