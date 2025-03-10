<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import Avatar from '$lib/components/layout/Avatar.svelte';
  import IconBrandDonationAlerts from '$lib/components/icons/IconBrandDonationAlerts.svelte';
  import { IconBrandGithub, IconBrandTwitch, IconBrandGoogle } from '@tabler/icons-svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Профиль</title>
</svelte:head>

<Card.Root class="mx-auto max-w-sm">
  <Card.Content class="flex justify-between">
    <h1 class="text-4xl font-bold">{data.user.username}</h1>
    <Avatar user={data.user} class="size-20" />
  </Card.Content>
  <Card.Footer>
    <form method="post" action="/logout" use:enhance>
      <Button type="submit" variant="destructive">Выйти</Button>
    </form>
  </Card.Footer>
</Card.Root>

<Card.Root class="mx-auto max-w-sm">
  <Card.Header>
    <Card.Title>Сервисы</Card.Title>
  </Card.Header>
  <Card.Content class="space-y-4">
    <Button class="w-full" variant="twitch"><IconBrandTwitch />Подключить Twitch</Button>
    <Button class="w-full" variant="google"><IconBrandGoogle />Подключить Google</Button>
    <Button class="w-full" variant="donationalerts"
      ><IconBrandDonationAlerts />Подключить DonationAlerts</Button
    >
    <Button class="w-full" variant="github" href="/login/github"
      ><IconBrandGithub />Подключить GitHub</Button
    >
  </Card.Content>
</Card.Root>
