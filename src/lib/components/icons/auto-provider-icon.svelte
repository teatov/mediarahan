<script lang="ts">
  import { IconBrandGithub, IconBrandTwitch, IconBrandGoogle } from '@tabler/icons-svelte';
  import IconBrandDonatePay from '$lib/components/icons/icon-brand-donatepay.svelte';
  import IconBrandDonationAlerts from '$lib/components/icons/icon-brand-donationalerts.svelte';
  import type { ProviderName } from '$lib/providers';

  let { providerName, ...restProps }: { providerName: ProviderName } & IconProps = $props();
</script>

{#if providerName === 'github'}
  <IconBrandGithub {...restProps} />
{:else if providerName === 'twitch'}
  <IconBrandTwitch {...restProps} />
{:else if providerName === 'google'}
  <IconBrandGoogle {...restProps} />
{:else if providerName === 'donationalerts'}
  <IconBrandDonationAlerts {...restProps} />
{:else if providerName === 'donatepay'}
  <IconBrandDonatePay {...restProps} />
{/if}
