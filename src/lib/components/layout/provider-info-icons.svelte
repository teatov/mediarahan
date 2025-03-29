<script lang="ts">
  import { IconLogin, IconMessageStar, IconMessageDollar } from '@tabler/icons-svelte';
  import { type ProviderName, PROVIDER_INFO } from '$lib/providers';

  let { providerName, oauth = true }: { providerName: ProviderName; oauth?: boolean } = $props();

  const provider = PROVIDER_INFO[providerName];
</script>

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
{#if oauth && provider.oauth}
  <span title="Через этот сервис можно входить в аккаунт" class="cursor-help">
    <IconLogin />
  </span>
{/if}
