<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, type ButtonVariant } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import Avatar from '$lib/components/layout/Avatar.svelte';
  import AutoProviderIcon from '$lib/components/icons/AutoProviderIcon.svelte';
  import { IconLogout } from '@tabler/icons-svelte';
  import type { Provider } from '$lib';

  let { data } = $props();

  const providers = data.user.externalAccounts.map((externalAccount) => externalAccount.provider);
</script>

<svelte:head>
  <title>Профиль</title>
</svelte:head>

{#snippet providerButton(provider: Provider, name: string)}
  {@const included = providers.includes(provider)}
  <Button
    class="w-full"
    variant={(included ? provider + 'Outline' : provider) as any}
    href={'/login/' + provider}
  >
    <AutoProviderIcon {provider} />{#if included}
      Отключить
    {:else}
      Подключить
    {/if}
    {name}
  </Button>
{/snippet}

<Card.Root class="mx-auto max-w-sm">
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

<Card.Root class="mx-auto max-w-sm">
  <Card.Header>
    <Card.Title>Сервисы</Card.Title>
  </Card.Header>
  <Card.Content class="space-y-4">
    {@render providerButton('twitch', 'Twitch')}
    {@render providerButton('google', 'Google')}
    {@render providerButton('donationalerts', 'DonationAlerts')}
    {@render providerButton('donatepay', 'DonatePay')}
    {@render providerButton('github', 'GitHub')}
  </Card.Content>
</Card.Root>
