<script lang="ts">
  import { IconBrandGithub, IconBrandTwitch, IconBrandGoogle } from '@tabler/icons-svelte';
  import IconBrandDonationAlerts from '$lib/components/icons/IconBrandDonationAlerts.svelte';
  import IconBrandDonatePay from '$lib/components/icons/IconBrandDonatePay.svelte';
  import type { Provider } from '$lib';

  let { provider, ...restProps }: { provider: Provider; [x: string]: any } = $props();
</script>

{#if provider === 'github'}
  <IconBrandGithub {...restProps} />
{:else if provider === 'twitch'}
  <IconBrandTwitch {...restProps} />
{:else if provider === 'google'}
  <IconBrandGoogle {...restProps} />
{:else if provider === 'donationalerts'}
  <IconBrandDonationAlerts {...restProps} />
{:else if provider === 'donatepay'}
  <IconBrandDonatePay {...restProps} />
{/if}
