<script lang="ts">
  import Input from '$lib/atoms/Input.svelte';
</script>

<div class="container">
  <Input name="test" label="Name" maxBytes={10} value="12345678901" />
</div>

<style lang="scss">
  .container {
    margin: 0 auto;
    padding: 30vh 16px;
    max-width: 400px;
  }
</style>
