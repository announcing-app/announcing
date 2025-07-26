<script lang="ts">
  import { page } from '$app/state';
  import { back } from '$lib/actions/back';
  import AnnouncementView from '$lib/parts/AnnouncementView/AnnouncementView.svelte';
  import { LL } from '@announcing/i18n';
  import { error } from '@sveltejs/kit';
  import { channelData } from '../../channelData';

  let id = $state(page.params['id']);

  let announcement = $derived.by(() => {
    const a = channelData.get(id as string);
    if (!a) {
      error(404);
    }
    return a;
  });
</script>

<div class="wrapper">
  <div class="container">
    <div class="header">
      <a href="../../ChannelView" use:back>{$LL.back()}</a>
    </div>
    <AnnouncementView {announcement} />
  </div>
</div>

<style lang="scss">
  .wrapper {
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: var(--color-background);

      .header {
        padding: 8px;
        margin-bottom: 16px;
        border-bottom: 1px solid var(--color-border);
      }
    }
  }
</style>
