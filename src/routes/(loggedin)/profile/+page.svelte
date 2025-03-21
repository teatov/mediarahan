<script lang="ts">
  import {
    IconLogout,
    IconTrash,
    IconLogin,
    IconMessageStar,
    IconMessageDollar,
  } from '@tabler/icons-svelte';
  import { enhance } from '$app/forms';
  import AutoProviderIcon from '$lib/components/icons/auto-provider-icon.svelte';
  import Avatar from '$lib/components/layout/avatar.svelte';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { Button, buttonVariants, type ButtonVariant } from '$lib/components/ui/button';
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
  import EditProfile from './edit-profile.svelte';

  let { data } = $props();
  let { user, externalAccounts, editProfileForm, avatarUrl } = data;

  const userProviders = Object.keys(externalAccounts) as ProviderName[];
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
        <strong class="ml-1">{externalAccounts[provider].externalUsername}</strong>
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
        {@render removeProviderDialog(provider)}
      </div>
    </div>
  {:else}
    <Button class="w-full" variant={provider} href={'/login/' + provider}>
      <AutoProviderIcon {provider} />Привязать {providerLabels[provider]}
    </Button>
  {/if}
{/snippet}

{#snippet removeProviderDialog(provider: ProviderName)}
  <AlertDialog.Root>
    <AlertDialog.Trigger
      class={buttonVariants({ variant: (provider + 'Outline') as ButtonVariant })}
    >
      Отвязать
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Отвязать {providerLabels[provider]} от аккаунта?</AlertDialog.Title>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Отмена</AlertDialog.Cancel>
        <AlertDialog.Action class={buttonVariants({ variant: 'destructive' })}>
          Отвязать
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
{/snippet}

{#snippet deleteAccountDialog()}
  <AlertDialog.Root>
    <AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' }) + ' w-full'}>
      <IconTrash />Удалить аккаунт
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title class="text-destructive">Удалить аккаунт?</AlertDialog.Title>
        <AlertDialog.Description>
          Будет удалено <b>ВСЁ</b> что связано с вашим аккаунтом. Навсегда.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Отмена</AlertDialog.Cancel>
        <AlertDialog.Root>
          <AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
            Удалить
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title class="text-destructive">ТОЧНО?</AlertDialog.Title>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Не точно</AlertDialog.Cancel>
              <AlertDialog.Action class={buttonVariants({ variant: 'destructive' })}>
                Точно.
              </AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
{/snippet}

<Card.Root class="mx-auto max-w-lg">
  <Card.Content class="flex gap-6">
    <Avatar username={user.username} src={avatarUrl} class="size-24" />
    <div class="space-y-2 w-full min-w-0">
      <h1 class="text-4xl font-bold truncate" title={user.username}>{user.username}</h1>
      <div class="flex justify-between flex-wrap gap-2">
        <EditProfile data={editProfileForm} externalAccounts={user.externalAccounts} />
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
    {@render deleteAccountDialog()}
  </Card.Content>
</Card.Root>
