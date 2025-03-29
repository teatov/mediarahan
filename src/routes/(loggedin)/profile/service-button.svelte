<script lang="ts">
  import { IconLogin, IconMessageStar, IconMessageDollar } from '@tabler/icons-svelte';
  import AutoProviderIcon from '$lib/components/icons/auto-provider-icon.svelte';
  import ProviderInfoIcons from '$lib/components/layout/provider-info-icons.svelte';
  import { type ProviderName, PROVIDER_INFO } from '$lib/providers';
  import RemoveService from './remove-service.svelte';

  let { providerName, externalUsername }: { providerName: ProviderName; externalUsername: string } =
    $props();

  const provider = PROVIDER_INFO[providerName];
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
    <ProviderInfoIcons {providerName} />
    <RemoveService {providerName} />
  </div>
</div>
