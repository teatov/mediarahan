<script lang="ts">
  import * as Card from '$lib/components/ui/card';

  let { data } = $props();

  let { wheel } = $derived(data);
</script>

<svelte:head>
  <title>Настройки колеса</title>
</svelte:head>

<Card.Root class="mx-auto max-w-lg">
  <Card.Header>
    <Card.Title>Настройки колеса</Card.Title>
  </Card.Header>
  <Card.Content class="space-y-4">
    <pre>{JSON.stringify(wheel, null, 2)}</pre>
  </Card.Content>
</Card.Root>
