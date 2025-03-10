<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
</script>

<Card.Root class="mx-auto w-[380px]">
  <Card.Header>
    <Card.Title>Войти или зарегистрироваться</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-4">
    <Button class="w-full">Войти</Button>
  </Card.Content>
</Card.Root>
