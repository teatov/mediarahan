<script lang="ts">
  import { IconLogin, IconMessageStar, IconMessageDollar } from '@tabler/icons-svelte';
  import AutoProviderIcon from '$lib/components/icons/auto-provider-icon.svelte';
  import {
    type ProviderName,
    authProviders,
    donationSocketProviders,
    pointSocketProviders,
    providerLabels,
    providerStyles,
  } from '$lib/providers';
  import RemoveService from './remove-service.svelte';

  let { provider, externalUsername }: { provider: ProviderName; externalUsername: string } =
    $props();
</script>

<div class="flex items-center justify-between gap-2">
  <div class="truncate">
    <span class={providerStyles[provider]}>
      <AutoProviderIcon {provider} class="inline -mt-0.5" />
      {providerLabels[provider]}
    </span>:
    <span class="ml-1 font-semibold">{externalUsername}</span>
  </div>
  <div class="flex items-center gap-2">
    {#if pointSocketProviders.includes(provider)}
      <span title="Через этот сервис можно принимать награды за баллы канала" class="cursor-help">
        <IconMessageStar />
      </span>
    {/if}
    {#if donationSocketProviders.includes(provider)}
      <span title="Через этот сервис можно принимать донаты" class="cursor-help">
        <IconMessageDollar />
      </span>
    {/if}
    {#if authProviders.includes(provider)}
      <span title="Через этот сервис можно входить в аккаунт" class="cursor-help">
        <IconLogin />
      </span>
    {/if}
    <RemoveService {provider} />
  </div>
</div>
