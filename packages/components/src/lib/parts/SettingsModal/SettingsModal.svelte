<script lang="ts">
  import Loading from '$lib/atoms/Loading.svelte';
  import Modal from '$lib/atoms/Modal.svelte';
  import MaterialSymbolsLanguage from '$lib/icons/MaterialSymbolsLanguage.svelte';
  import MdiThemeLightDark from '$lib/icons/MdiThemeLightDark.svelte';
  import {
    getTheme,
    getToolbarSize,
    initTheme,
    setLocale,
    setTheme,
    setToolbarSize,
    type Themes,
  } from '$lib/utils/settings';
  import { LL, type Locales } from '@announcing/i18n';
  import { onMount } from 'svelte';

  const localeValues = [
    ['en', 'English'],
    ['ja', '日本語'],
  ] satisfies [Locales, string][];

  interface Props {
    requestLocale: Locales;
    requestTheme: Themes | undefined;
    toolbarSize?: string | undefined;
  }

  let { requestLocale, requestTheme, toolbarSize = $bindable() }: Props = $props();

  let open = $state(false);
  let loading = $state(false);
  let locale = $state(requestLocale);
  let theme = $state(requestTheme ?? getTheme());

  let themes = $derived<[Themes, string][]>([
    ['light', $LL.lightMode()],
    ['dark', $LL.darkMode()],
  ]);

  let toolbarSizes = $derived<[string, string][]>([
    ['normal', $LL.normal()],
    ['compact', $LL.compact()],
  ]);

  onMount(() => {
    initTheme();

    toolbarSize = getToolbarSize();
  });

  $effect(() => {
    loading = true;
    setLocale(locale)
      .catch(() => {
        //
      })
      .finally(() => {
        loading = false;
      });
  });

  $effect(() => {
    setTheme(theme);
  });

  $effect(() => {
    if (toolbarSize) {
      setToolbarSize(toolbarSize);
    }
  });

  export const openModal = () => {
    open = true;
  };
</script>

<div id="settings" data-locale={locale} data-theme={theme}></div>

<Modal bind:open dismissMode="backdrop">
  <div class="modal-body">
    <div class="item">
      <div class="title">
        <MaterialSymbolsLanguage />Language
      </div>
      <div class="choices">
        {#each localeValues as [value, label] (value)}
          <label>
            <input type="radio" name="locale" {value} bind:group={locale} />{label}
          </label>
        {/each}
      </div>
    </div>

    <div class="item">
      <div class="title">
        <MdiThemeLightDark />{$LL.theme()}
      </div>
      <div class="choices">
        {#each themes as [value, label] (value)}
          <label>
            <input type="radio" name="theme" {value} bind:group={theme} />{label}
          </label>
        {/each}
      </div>
    </div>

    <div class="item">
      <div class="title">{$LL.toolbarSize()}</div>
      <div class="choices">
        {#each toolbarSizes as [value, label] (value)}
          <label>
            <input type="radio" name="toolbar" {value} bind:group={toolbarSize} />
            {label}
          </label>
        {/each}
      </div>
    </div>

    <button
      class="close-btn small filled"
      onclick={() => {
        open = false;
      }}>{$LL.close()}</button
    >
  </div>
</Modal>

<Loading show={loading} showDelay="0.5s" />

<style lang="scss">
  #settings {
    display: none;
  }

  .modal-body {
    background-color: var(--color-background);
    border-radius: 16px;
    margin: auto;
    padding: 16px;
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 32px;

    .item {
      display: flex;
      flex-direction: column;
      gap: 16px;
      .title {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .choices {
        display: flex;
        margin: 0 auto;
        gap: 16px;
      }
    }

    .close-btn {
      display: block;
      margin: 0 auto;
    }

    @keyframes showDelay {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
</style>
