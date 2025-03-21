<script lang="ts">
  import { IconLogout, IconLogin, IconMessageStar, IconMessageDollar } from '@tabler/icons-svelte';
  import { enhance } from '$app/forms';
  import AutoProviderIcon from '$lib/components/icons/auto-provider-icon.svelte';
  import Avatar from '$lib/components/layout/avatar.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import {
    type ProviderName,
    authProviders,
    donationSocketProviders,
    pointSocketProviders,
    providerLabels,
    providerStyles,
    providers,
  } from '$lib/providers';
  import DeleteAccount from './delete-account.svelte';
  import DonatePayLogin from './donatepay-login.svelte';
  import EditProfile from './edit-profile.svelte';
  import RemoveService from './remove-service.svelte';

  let { data } = $props();

  let { user, externalAccounts, editProfileForm, avatarUrl, donatePayLoginForm } = $derived(data);

  const userProviders = $derived(Object.keys(externalAccounts) as ProviderName[]);
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
        <span class="ml-1 font-semibold">{externalAccounts[provider].externalUsername}</span>
      </div>
      <div class="flex items-center gap-2">
        {#if pointSocketProviders.includes(provider)}
          <span
            title="Через этот сервис можно принимать награды за баллы канала"
            class="cursor-help"
          >
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
  {:else if provider === 'donatepay'}
    <DonatePayLogin data={donatePayLoginForm}>
      <AutoProviderIcon {provider} />Привязать {providerLabels[provider]}
    </DonatePayLogin>
  {:else}
    <Button class="w-full" variant={provider} href={'/login/' + provider}>
      <AutoProviderIcon {provider} />Привязать {providerLabels[provider]}
    </Button>
  {/if}
{/snippet}

<Card.Root class="mx-auto max-w-lg">
  <Card.Content class="flex gap-6">
    <Avatar username={user.username} src={avatarUrl} class="size-24" />
    <div class="space-y-2 w-full min-w-0">
      <h1 class="text-4xl font-bold" title={user.username}>{user.username}</h1>
      <div class="flex justify-between flex-wrap gap-2">
        <EditProfile data={editProfileForm} externalAccounts={user.externalAccounts} />
        <form method="POST" action="/logout" use:enhance>
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
    <DeleteAccount />
  </Card.Content>
</Card.Root>
