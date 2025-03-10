<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, type ButtonVariant } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import Avatar from '$lib/components/layout/Avatar.svelte';
  import AutoProviderIcon from '$lib/components/icons/AutoProviderIcon.svelte';
  import { IconLogout } from '@tabler/icons-svelte';
  import type { ProviderName } from '$lib';

  let { data } = $props();

  const providers = data.user.externalAccounts.map((externalAccount) => externalAccount.provider);
  const externalUsernames = data.user.externalAccounts.reduce(
    (prev, curr) => {
      prev[curr.provider] = curr.externalUsername;
      return prev;
    },
    {} as Record<ProviderName, string>
  );
</script>

<svelte:head>
  <title>Профиль</title>
</svelte:head>

{#snippet providerButton(provider: ProviderName, name: string, className: string)}
  {#if providers.includes(provider)}
    <div class={`flex items-center justify-between ${className}`}>
      <div class="flex items-center gap-2">
        <AutoProviderIcon {provider} />
        {name}: {externalUsernames[provider]}
      </div>
      <Button variant={(provider + 'Outline') as any} href={'/login/' + provider}>Отключить</Button>
    </div>
  {:else}
    <Button class="w-full" variant={provider} href={'/login/' + provider}>
      <AutoProviderIcon {provider} />Подключить {name}
    </Button>
  {/if}
{/snippet}

<Card.Root class="mx-auto max-w-md">
  <Card.Content class="flex justify-between">
    <h1 class="text-4xl font-bold">{data.user.username}</h1>
    <Avatar user={data.user} class="size-20" />
  </Card.Content>
  <Card.Footer class="justify-end">
    <form method="post" action="/logout" use:enhance>
      <Button type="submit" variant="destructive"><IconLogout />Выйти</Button>
    </form>
  </Card.Footer>
</Card.Root>

<Card.Root class="mx-auto max-w-md">
  <Card.Header>
    <Card.Title>Сервисы</Card.Title>
  </Card.Header>
  <Card.Content class="space-y-4">
    {@render providerButton('twitch', 'Twitch', 'text-twitch')}
    {@render providerButton('google', 'Google', 'text-google-foreground dark:text-google')}
    {@render providerButton('donationalerts', 'DonationAlerts', 'text-donationalerts')}
    {@render providerButton('donatepay', 'DonatePay', 'text-donatepay')}
    {@render providerButton('github', 'GitHub', 'text-github dark:text-github-foreground')}
  </Card.Content>
</Card.Root>
