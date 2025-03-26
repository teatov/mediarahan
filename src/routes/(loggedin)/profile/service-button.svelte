<script lang="ts">
  import { IconLogin, IconMessageStar, IconMessageDollar } from '@tabler/icons-svelte';
  import AutoProviderIcon from '$lib/components/icons/auto-provider-icon.svelte';
  import { type ProviderName, providerInfo } from '$lib/providers';
  import RemoveService from './remove-service.svelte';

  let { providerName, externalUsername }: { providerName: ProviderName; externalUsername: string } =
    $props();

  const provider = providerInfo[providerName];
</script>

<div class="flex items-center justify-between gap-2">
  <div class="truncate">
    <span class={provider.style}>
      <AutoProviderIcon {providerName} class="inline -mt-0.5" />
      {provider.label}
    </span>:
    <span class="ml-1 font-semibold">{externalUsername}</span>
  </div>
  <div class="flex items-center gap-2">
    {#if provider.socket?.points}
      <span title="Через этот сервис можно принимать награды за баллы канала" class="cursor-help">
        <IconMessageStar />
      </span>
    {/if}
    {#if provider.socket?.donations}
      <span title="Через этот сервис можно принимать донаты" class="cursor-help">
        <IconMessageDollar />
      </span>
    {/if}
    {#if provider.auth}
      <span title="Через этот сервис можно входить в аккаунт" class="cursor-help">
        <IconLogin />
      </span>
    {/if}
    <RemoveService {providerName} />
  </div>
</div>
