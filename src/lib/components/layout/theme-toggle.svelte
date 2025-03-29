<script lang="ts">
  import { IconSun, IconMoon } from '@tabler/icons-svelte';
  import { toggleMode } from 'mode-watcher';
  import { Button } from '$lib/components/ui/button';
</script>

<Button onclick={toggleMode} variant="outline" size="icon" title="Переключить светлую/тёмную тему">
  <IconMoon class="scale-100 dark:scale-0" />
  <IconSun class="absolute scale-0 dark:scale-100" />
  <span class="sr-only">Toggle theme</span>
</Button>
