<script lang="ts">
  interface Props {
    show?: boolean;
  }

  let { show = false }: Props = $props();
</script>

{#if show}
  <div class="container">
    <div class="bar"></div>
  </div>
{/if}

<style lang="scss">
  .container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;

    .bar {
      width: 50%;
      height: 4px;
      background-color: var(--color-accent);
      animation: 5s ease-out infinite progress;

      @keyframes progress {
        0%,
        10% {
          width: 0;
        }
        100% {
          width: 100%;
        }
      }
    }
  }
</style>
