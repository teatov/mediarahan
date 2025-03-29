<script lang="ts">
  let { data } = $props();
  let { wheel } = $derived(data);
</script>

<svelte:head>
  <title>{wheel.name}</title>
</svelte:head>

<div class="text-center">
  {wheel.name}
</div>
