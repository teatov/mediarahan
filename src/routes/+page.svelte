<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { toast } from "svelte-sonner";
</script>

<svelte:head>
  <title>Mediarahan - набор потенциально полезных инструментов для стримеров</title>
</svelte:head>

<main class="container max-w-xl">
  <h1>Welcome to SvelteKit</h1>
  <p>
    Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
  </p>
  <Button>Click me</Button>
  <Button onclick={() => toast("Hello world", {
    description: 'Monday, January 3rd at 6:00pm'
  })}>Show toast</Button>
</main>
