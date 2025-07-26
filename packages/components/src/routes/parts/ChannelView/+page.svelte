<script lang="ts" module>
  const loaded = new Set<string>();
</script>

<script lang="ts">
  import { page } from '$app/state';
  import ChannelView from '$lib/parts/ChannelView/ChannelView.svelte';
  import { createSnapshotContext } from '$lib/utils/snapshotContext';
  import type { ComponentProps } from 'svelte';
  import { channelData } from './channelData';

  export const snapshot = createSnapshotContext();

  type ChannelViewProps = ComponentProps<typeof ChannelView>;

  const announcementLoader: ChannelViewProps['announcementLoader'] = (key: string) => {
    const result = channelData.get(key);

    if (loaded.has(key)) {
      return result;
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!result) {
          reject('No data');
          return;
        }
        loaded.add(key);
        resolve(result);
      }, 1000);
    });
  };

  const props: ChannelViewProps = {
    channel: {
      name: 'Aether Dynamics Corporation',
      desc: 'Aether Dynamics Corporation is at the forefront of cutting-edge technology, pioneering advancements in energy solutions and sustainable innovation.\nJoin us as we transform the future with dynamic, visionary science.',
      icon: '/assets/logo.png',
    },
    announcementHrefPrefix: `${page.url.pathname}/announcements`,
    announcementKeys: [...channelData.keys()],
    announcementLoader,
  };
</script>

<div class="container">
  <ChannelView {...props} />
</div>

<style lang="scss">
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 8px 0;
  }
</style>
