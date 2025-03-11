<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { source } from 'sveltekit-sse';
  import type { SSE } from '$lib/sse';

  let message = $state<SSE>({ type: 'none' });

  const sseSource = source('/sse', {
    open: () => {
      console.log('SSE открыт!');
    },
    close: () => {
      console.log('SSE закрыт...');
    },
    error: () => {
      console.log('SSE ошибка!!!');
    },
    cache: false,
  });

  onMount(() => {
    sseSource
      .select('message')
      .transform(function run(data) {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error(`Не удалось распарсить JSON '${data}'`, e);
        }
      })
      .subscribe((value) => {
        if (!value) return;
        message = value;
      });
  });

  onDestroy(() => {
    sseSource.close();
  });
</script>

{JSON.stringify(message)}
