<script>
  import { LL, locale } from '@announcing/i18n';
</script>

<div class="container">
  <div class="subtitle">{$LL.subtitle()}</div>
  <div class="title">Announcing</div>
  <a
    class="button small"
    href={`https://github.com/suzulabo/announcing.202312/tree/main/docs/concept_${$locale}.md`}
    >{$LL.serviceDetails()}</a
  >
</div>

<svelte:head>
  <title>Announcing</title>
</svelte:head>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    margin: 32px 16px;

    .subtitle {
      font-size: 14px;
      color: var(--color-text-subtle);
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      margin: 0 0 16px;
    }
  }
</style>
