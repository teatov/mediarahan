<script lang="ts">
  import { toast } from 'svelte-sonner';
  import DateTimeFormat from '$lib/components/format/datetime-format.svelte';
  import NumberFormat from '$lib/components/format/number-format.svelte';
  import Spinner from '$lib/components/icons/spinner.svelte';
  import { Button } from '$lib/components/ui/button';
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
  <Button
    onclick={() =>
      toast.promise(() => new Promise((resolve) => setTimeout(resolve, 5000)), {
        loading: 'Loading',
        success: 'Success',
        error: 'Error',
      })}>Show toast</Button
  >
  <Spinner />
  <p><DateTimeFormat datetime={new Date()} type="date" /></p>
  <p><DateTimeFormat datetime={new Date()} type="time" /></p>
  <p><DateTimeFormat datetime={new Date()} /></p>
  <p><NumberFormat value={50000} currency="RUB" /></p>
  <a href="/sse">sse</a>
</main>
