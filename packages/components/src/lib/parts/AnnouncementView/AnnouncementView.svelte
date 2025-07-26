<script lang="ts">
  import DefaultAnnouncementView from './default/DefaultAnnouncementView.svelte';
  import type { AnnouncementViewProps } from './types';

  let props: AnnouncementViewProps = $props();
</script>

<DefaultAnnouncementView {...props} />
