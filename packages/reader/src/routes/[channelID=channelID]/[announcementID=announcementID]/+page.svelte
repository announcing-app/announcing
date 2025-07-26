<script lang="ts">
  import { back } from '@announcing/components/actions/back';
  import AnnouncementView from '@announcing/components/AnnouncementView.svelte';
  import { LL } from '@announcing/i18n';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<svelte:head>
  <title>{data.announcement.title ?? data.announcement.body}</title>
</svelte:head>

<AnnouncementView channel={data.channel} announcement={data.announcement} />

<a class="button small" href={`/${data.channelID}`} use:back>{$LL.back()}</a>

<style lang="scss">
  a {
    margin: 32px auto 0;
  }
</style>
