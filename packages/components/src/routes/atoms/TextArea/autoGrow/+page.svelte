<script lang="ts">
  import TextArea from '$lib/atoms/TextArea.svelte';

  const text = `
1
23
456
7890
11111
222222
3333333
  `.trim();
</script>

<div class="container">
  <TextArea name="test" label="Name" value={text} />
</div>

<style lang="scss">
  .container {
    margin: 0 auto;
    padding: 30vh 16px;
    max-width: 400px;
  }
</style>
