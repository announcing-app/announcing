<script lang="ts">
  import TextArea from '$lib/atoms/TextArea.svelte';
</script>

<div class="container">
  <TextArea name="test" label="Name" maxBytes={10} value="1234567890\n1" />
</div>

<style lang="scss">
  .container {
    margin: 0 auto;
    padding: 30vh 16px;
    max-width: 400px;
  }
</style>
