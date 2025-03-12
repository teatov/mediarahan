<script lang="ts">
  import { IconLogout, IconTrash, IconLogin, IconMessage, IconEdit } from '@tabler/icons-svelte';
  import { enhance } from '$app/forms';
  import AutoProviderIcon from '$lib/components/icons/AutoProviderIcon.svelte';
  import Avatar from '$lib/components/layout/Avatar.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import {
    type ProviderName,
    authProviders,
    providerLabels,
    providerStyles,
    providers,
    socketProviders,
  } from '$lib/providers';

  let { data } = $props();
  let { user } = data;

  const userProviders = user.externalAccounts.map((externalAccount) => externalAccount.provider);
  const externalUsernames = user.externalAccounts.reduce(
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

{#snippet providerButton(provider: ProviderName)}
  {#if userProviders.includes(provider)}
    <div class="flex items-center justify-between gap-2">
      <div class="truncate">
        <span class={providerStyles[provider]}>
          <AutoProviderIcon {provider} class="inline -mt-0.5" />
          {providerLabels[provider]}
        </span>:
        <strong class="ml-1">{externalUsernames[provider]}</strong>
      </div>
      <div class="flex items-center gap-2">
        {#if socketProviders.includes(provider)}
          <span title="Через этот сервис можно принимать сообщения" class="cursor-help">
            <IconMessage />
          </span>
        {/if}
        {#if authProviders.includes(provider)}
          <span title="Через этот сервис можно входить в аккаунт" class="cursor-help">
            <IconLogin />
          </span>
        {/if}
        <Button variant={(provider + 'Outline') as any} href={'/login/' + provider}>
          Отвязать
        </Button>
      </div>
    </div>
  {:else}
    <Button class="w-full" variant={provider} href={'/login/' + provider}>
      <AutoProviderIcon {provider} />Привязать {providerLabels[provider]}
    </Button>
  {/if}
{/snippet}

<Card.Root class="mx-auto max-w-lg">
  <Card.Content class="flex gap-6">
    <Avatar {user} class="size-24" />
    <div class="space-y-2 w-full min-w-0">
      <h1 class="text-4xl font-bold truncate" title={user.username}>{user.username}</h1>
      <div class="flex justify-between flex-wrap gap-2">
        <Button><IconEdit />Редактировать</Button>
        <form method="post" action="/logout" use:enhance>
          <Button type="submit" variant="destructive"><IconLogout />Выйти</Button>
        </form>
      </div>
    </div>
  </Card.Content>
</Card.Root>

<Card.Root class="mx-auto max-w-lg">
  <Card.Header>
    <Card.Title>Сервисы</Card.Title>
  </Card.Header>
  <Card.Content class="space-y-4">
    {#each providers as provider}
      {@render providerButton(provider)}
    {/each}
  </Card.Content>
</Card.Root>

<Card.Root class="mx-auto max-w-lg">
  <Card.Header>
    <Card.Title>Опасное</Card.Title>
  </Card.Header>
  <Card.Content class="space-y-4">
    <form method="post" action="/delete" use:enhance>
      <Button type="submit" variant="destructive" class="w-full">
        <IconTrash />Удалить аккаунт
      </Button>
    </form>
  </Card.Content>
</Card.Root>
