<script lang="ts">
  import IconBrandDonationAlerts from '$lib/components/icons/IconBrandDonationAlerts.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { IconBrandGithub, IconBrandTwitch, IconBrandGoogle } from '@tabler/icons-svelte';
</script>

<Card.Root class="mx-auto max-w-sm">
  <Card.Header>
    <Card.Title>Войти или зарегистрироваться</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <Button class="w-full" variant="twitch"><IconBrandTwitch />Через Twitch</Button>
    <Button class="w-full" variant="google"><IconBrandGoogle />Через Google</Button>
    <Button class="w-full" variant="donationalerts"
      ><IconBrandDonationAlerts />Через DonationAlerts</Button
    >
    <Button class="w-full" variant="github" href="/login/github"
      ><IconBrandGithub />Через GitHub</Button
    >
  </Card.Content>
</Card.Root>
