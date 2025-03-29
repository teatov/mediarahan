<script lang="ts">
  let { data } = $props();
  let { currentWheel } = $derived(data);
</script>

<svelte:head>
  <title>{currentWheel?.name ?? 'Колесо'}</title>
</svelte:head>

Колесо
