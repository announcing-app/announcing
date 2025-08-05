<script lang="ts" module>
  const reportedSet = new Set<string>();
</script>

<script lang="ts">
  import { postReport } from '$lib/fetch/postReport';
  import { back } from '@announcing/components/actions/back';
  import AnnouncementView from '@announcing/components/AnnouncementView.svelte';
  import Loading from '@announcing/components/Loading.svelte';
  import { LL } from '@announcing/i18n';
  import type { PageData } from './$types';
  import ReportModal from './ReportModal.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let channelID = $derived(data.channelID);
  let announcementID = $derived(data.announcementID);
  let loading = $state(false);
  let reported = $derived(reportedSet.has(`${channelID}/${announcementID}`));

  let reportModal: ReportModal;
</script>

<svelte:head>
  <title>{data.announcement.title ?? data.announcement.body}</title>
</svelte:head>

<AnnouncementView channel={data.channel} announcement={data.announcement} />

{#if reported}
  <div class="report">{$LL.reported()}</div>
{:else}
  <button
    class="report small"
    onclick={() => {
      reportModal.openModal(async (details) => {
        loading = true;
        try {
          await postReport({
            channelID,
            announcementID,
            details,
          });
          reportedSet.add(`${channelID}/${announcementID}`);
          reported = true;
        } finally {
          loading = false;
        }
      });
    }}>{$LL.report()}</button
  >
{/if}

<a class="button small" href={`/${data.channelID}`} use:back>{$LL.back()}</a>

<ReportModal bind:this={reportModal} />

<Loading show={loading} />

<style lang="scss">
  a {
    margin: 32px auto 0;
  }
  .report {
    margin: 16px 16px 0 auto;
    color: var(--color-text-subtle);
    font-size: 13px !important;
  }
  button.report {
    background-color: var(--color-surface);
    padding: 8px;
  }
</style>
