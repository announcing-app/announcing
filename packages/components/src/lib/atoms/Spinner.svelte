<!-- https://codepen.io/adrianmg/pen/Omedpo -->
<script lang="ts">
  import { toStyle } from '$lib/utils/toStyle';

  interface Props {
    size?: number;
    delay?: string;
  }

  let { size = 12, delay = '0' }: Props = $props();
</script>

<div class="spinner" style={toStyle({ 'font-size': `${size}px`, '--delay': delay })}>
  <div></div>
  <div></div>
  <div></div>
</div>

<style lang="scss">
  .spinner {
    animation: showDelay var(--delay) ease-in;

    @keyframes showDelay {
      0%,
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    & > div {
      width: 1em;
      height: 1em;
      background-color: var(--color-text);
      border-radius: 100%;
      display: inline-block;
      animation: bounceDelay 1.3s infinite ease-in-out both;
    }
    & > div:nth-child(1) {
      animation-delay: 0s;
    }
    & > div:nth-child(2) {
      animation-delay: 0.16s;
      margin: 0 0.25em;
    }
    & > div:nth-child(3) {
      animation-delay: 0.32s;
    }
    @keyframes bounceDelay {
      0%,
      80%,
      100% {
        opacity: 0.1;
      }
      40% {
        opacity: 1;
      }
    }
  }
</style>
