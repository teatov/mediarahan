<script lang="ts">
  import { IconBrandGithub, IconBrandTwitch, IconBrandGoogle } from '@tabler/icons-svelte';
  import IconBrandDonationAlerts from '$lib/components/icons/IconBrandDonationAlerts.svelte';

  let { provider, ...restProps }: { provider: string; [x: string]: any } = $props();
</script>

{#if provider === 'github'}
  <IconBrandGithub {...restProps} />
{:else if provider === 'twitch'}
  <IconBrandTwitch {...restProps} />
{:else if provider === 'google'}
  <IconBrandGoogle {...restProps} />
{:else if provider === 'donationalerts'}
  <IconBrandDonationAlerts {...restProps} />
{/if}
