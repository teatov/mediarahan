<script lang="ts">
  import NewWheel from './new-wheel.svelte';
  import WheelList from './wheel-list.svelte';
  import WheelSettings from './wheel-settings.svelte';

  let { data } = $props();
  let {
    currentWheel,
    currentWheelForm,
    newWheelForm,
    wheelSettingsForm,
    wheels,
    externalAccounts,
  } = $derived(data);
</script>

<svelte:head>
  <title>{currentWheel?.name ?? 'Колесо'} - Настройки</title>
</svelte:head>

<div class="mx-auto max-w-lg space-y-2">
  {#if currentWheel}
    <h1 class="text-4xl font-extrabold tracking-tight">
      {currentWheel.name}
    </h1>
  {/if}
  <div class="flex gap-4 items-center flex-col sm:flex-row">
    {#if wheels.length > 0}
      <WheelList data={currentWheelForm} {wheels} />
    {:else}
      <div class="w-full">Колёс нет. Создайте новое:</div>
    {/if}
    <NewWheel data={newWheelForm} />
  </div>
</div>

{#if currentWheel && wheelSettingsForm}
  <WheelSettings wheelId={currentWheel.id} data={wheelSettingsForm} {externalAccounts} />
{/if}
