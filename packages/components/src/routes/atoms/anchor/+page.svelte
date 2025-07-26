<script lang="ts">
  import { toHtml } from '$lib/utils/toHtml';

  const text = `If you’re interested in exploring open-source projects, visit https://github.com to find repositories on nearly every topic imaginable, from software development to data science.`;
</script>

<div class="container">
  <div>
    <a href="https://github.com">Github</a>
  </div>
  <div class="text">
    {@html toHtml(text)}
  </div>
</div>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 30vh auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .text {
      :global(a) {
        text-decoration: underline;
      }
    }
  }
</style>
