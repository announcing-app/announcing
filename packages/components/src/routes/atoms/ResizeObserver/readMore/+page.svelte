<script lang="ts">
  import ResizeObserver from '$lib/atoms/ResizeObserver.svelte';

  let small = $state(true);
  let overflow = $state(false);
  let openReadMore = $state(false);
</script>

<div class="container">
  <button
    onclick={() => {
      small = !small;
    }}>{small ? 'Normal' : 'Small'}</button
  >
  <div class="wrapper" class:small>
    <ResizeObserver
      onResize={({ el }) => {
        overflow = el.scrollHeight > el.clientHeight;
        if (openReadMore && el.clientHeight <= 200) {
          openReadMore = false;
        }
      }}
    >
      <div class="overflow-fade" class:overflow class:openReadMore>
        Announcing is the world’s most boring web service, by design. Unlike traditional social
        media platforms, it strips away all the noise—there are no likes, comments, shares, or user
        interactions. It’s a space free from the clutter of social engagement, allowing you to focus
        solely on the content you care about. Essentially, Announcing is a stripped-down version of
        a social media platform, where RSS feeds take center stage in a minimalistic, familiar UI.
        You can follow your favorite websites and blogs without distractions or the risk of your
        data being tracked. Announcing has a strict no-tracking policy, ensuring your privacy is
        protected. No algorithms, no ads, and no intrusive data collection. It’s just pure content,
        delivered simply.
      </div>
    </ResizeObserver>
    <button
      class="text"
      class:overflow
      class:openReadMore
      onclick={() => {
        openReadMore = !openReadMore;
      }}>{openReadMore ? 'Read less' : 'Read more'}</button
    >
  </div>
</div>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .wrapper {
      padding: 8px;
      border: 2px solid silver;
      border-radius: 16px;

      &.small {
        max-width: 400px;
      }

      .overflow-fade {
        position: relative;
        overflow: hidden;

        &:not(:global(.openReadMore)) {
          max-height: 200px;
        }

        &.overflow:after {
          position: absolute;
          bottom: 0;
          top: 0;
          left: 0;
          right: 0;
          content: '';
          background: linear-gradient(to top, var(--color-background), transparent 20%);
          pointer-events: none;
        }
      }

      button {
        display: none;
        margin: 8px 4px 0 auto;

        &.overflow,
        &.openReadMore {
          display: block;
        }
      }
    }
  }
</style>
