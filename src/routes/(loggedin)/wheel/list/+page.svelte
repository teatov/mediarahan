<script lang="ts">
  let { data } = $props();
  let { currentWheel } = $derived(data);
</script>

<svelte:head>
  <title>{currentWheel?.name ?? 'Колесо'} - Список</title>
</svelte:head>

Список
