<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: Snippet;
  }

  let { data, children }: Props = $props();

  let { channel } = $derived(data);
</script>

<a class="channel-box" href={`/channels/${data.channel.channelID}`}>
  <span class="name">{channel.name}</span>
  {#if channel.icon}
    <img class="icon" alt="channel icon" src={channel.icon} />
  {/if}
</a>

{@render children?.()}

<style lang="scss">
  .channel-box {
    position: sticky;
    top: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: var(--color-background);
    padding: 8px 16px;
    margin: 0 0 16px;

    .name {
      font-weight: bold;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .icon {
      width: 32px;
      height: 32px;
      border-radius: 16px;
    }
  }
</style>
