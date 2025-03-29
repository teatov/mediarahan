<script lang="ts">
  import NoWheel from './no-wheel.svelte';

  let { data } = $props();
  let { currentWheel } = $derived(data);
</script>

<svelte:head>
  <title>{currentWheel?.name ?? 'Колесо'}</title>
</svelte:head>

{#if currentWheel}
  <div class="text-center">{currentWheel.name}</div>
{:else}
  <NoWheel />
{/if}
