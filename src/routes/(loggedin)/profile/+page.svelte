<script lang="ts">
  import { IconLogout } from '@tabler/icons-svelte';
  import { enhance } from '$app/forms';
  import AutoProviderIcon from '$lib/components/icons/auto-provider-icon.svelte';
  import Avatar from '$lib/components/layout/avatar.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { PROVIDER_INFO, PROVIDERS } from '$lib/providers';
  import DeleteAccount from './delete-account.svelte';
  import DonatePayLogin from './donatepay-login.svelte';
  import EditProfile from './edit-profile.svelte';
  import Emotes from './emotes.svelte';
  import ServiceButton from './service-button.svelte';

  let { data } = $props();
  let { user, externalAccounts, editProfileForm, avatarUrl, donatePayLoginForm, emoteSets } =
    $derived(data);
</script>

<svelte:head>
  <title>Профиль</title>
</svelte:head>

<Card.Root class="mx-auto max-w-lg">
  <Card.Content class="flex gap-6">
    <Avatar username={user.username} src={avatarUrl} class="size-24" />
    <div class="space-y-2 w-full min-w-0">
      <h1 class="text-4xl font-bold" title={user.username}>{user.username}</h1>
      <div class="flex justify-between flex-wrap gap-2">
        <EditProfile data={editProfileForm} {externalAccounts} />
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
    {#each PROVIDERS as providerName}
      {@const provider = PROVIDER_INFO[providerName]}
      {#if Object.keys(externalAccounts).includes(providerName)}
        <ServiceButton
          {providerName}
          externalUsername={externalAccounts[providerName]!.externalUsername}
        />
      {:else if providerName === 'donatepay'}
        <DonatePayLogin data={donatePayLoginForm}>
          <AutoProviderIcon {providerName} />Привязать {provider.label}
        </DonatePayLogin>
      {:else}
        <Button class="w-full" variant={providerName} href={'/login/' + providerName}>
          <AutoProviderIcon {providerName} />Привязать {provider.label}
        </Button>
      {/if}
    {/each}
  </Card.Content>
</Card.Root>

<Card.Root class="mx-auto max-w-lg">
  <Card.Header>
    <Card.Title>Смайлики</Card.Title>
  </Card.Header>
  <Card.Content class="space-y-4">
    {#if emoteSets.length === 0 && !externalAccounts.twitch}
      <Card.Description>
        Привяжите к аккаунту Twitch, чтобы из него можно было импортировать смайлики.
      </Card.Description>
    {:else}
      <Emotes {emoteSets} />
    {/if}
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
