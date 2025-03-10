<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { IconBrandGithub, IconBrandTwitch, IconBrandGoogle } from '@tabler/icons-svelte';
</script>

<svelte:head>
  <title>Войти или зарегистрироваться</title>
</svelte:head>

<Card.Root class="mx-auto max-w-sm">
  <Card.Header>
    <Card.Title>Войти или зарегистрироваться</Card.Title>
  </Card.Header>
  <Card.Content class="space-y-4">
    <Button class="w-full" variant="twitch" href="/login/twitch">
      <IconBrandTwitch />Через Twitch
    </Button>
    <Button class="w-full" variant="google" href="/login/google">
      <IconBrandGoogle />Через Google
    </Button>
    <Button class="w-full" variant="github" href="/login/github">
      <IconBrandGithub />Через GitHub
    </Button>
  </Card.Content>
</Card.Root>
