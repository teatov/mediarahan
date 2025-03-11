<script lang="ts">
  import { page } from '$app/state';

  let message = page.error?.message;

  if (page.status === 404) {
    message = 'Такой страницы у нас нет';
  }
  if (page.status === 500) {
    message = 'Произошло что-то страшное';
  }
</script>

<svelte:head>
  <title>Оказия...</title>
</svelte:head>

<div class="flex flex-col items-center">
  <span class="text-6xl font-bold">{page?.status}</span>
  <h1>{message}</h1>
</div>
