<script lang="ts">
  import { isIOS } from '$lib/platform/platform';
  import type { GetChannelResult } from '@announcing/db/types';
  import { LL } from '@announcing/i18n';

  interface Props {
    channel: GetChannelResult | undefined;
  }

  let { channel }: Props = $props();

  let copied = $state(false);
</script>

{#if !isIOS()}
  <div class="unsupported">
    <div class="icon">🥺</div>
    <div>{$LL.unsupportedNotification()}</div>
  </div>
{:else}
  <div class="unsupported-ios">
    {#if channel}
      <div class="channel-box">
        <div class="name-box">
          {channel.name}
          {#if channel.icon}
            <img src={channel.icon} alt="icon" />
          {/if}
        </div>
        <div
          class="desc"
          class:copied
          onanimationend={() => {
            copied = false;
          }}
        >
          {copied ? $LL.copied() : $LL.channelNumber()}
        </div>
        <div class="number-box">
          <input value={channel.channelID} readonly /><button
            onclick={async () => {
              await navigator.clipboard.writeText(channel.channelID);
              copied = true;
            }}>{$LL.copy()}</button
          >
        </div>
      </div>
    {/if}

    <div>{$LL.unsupportedNotificationIOS()}</div>
    <a class="button" href="/notification" target="_blank">{$LL.iOSNotificationSetupLink()}</a>
  </div>
{/if}

<style lang="scss">
  .unsupported {
    margin: 32px 16px 0;
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: center;

    .icon {
      font-size: 32px;
    }
  }

  .unsupported-ios {
    margin: 0 16px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: center;

    .channel-box {
      display: flex;
      flex-direction: column;
      align-items: center;

      .name-box {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        padding: 0 16px;

        img {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          object-fit: contain;
        }
      }

      .desc {
        color: var(--color-text-subtle);
        margin: 16px auto 8px;

        &.copied {
          animation: 1s showDelay;
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

      .number-box {
        display: flex;
        input {
          width: auto;
          flex-grow: 1;
          text-align: center;
          border-radius: 16px 0 0 16px;
        }
        button {
          border-radius: 0 16px 16px 0;
        }
      }
    }
  }
</style>
