<script lang="ts">
  import DefaultChannelView from './default/DefaultChannelView.svelte';
  import type { ChannelViewProps } from './types';

  let props: ChannelViewProps = $props();
</script>

<DefaultChannelView {...props} />
