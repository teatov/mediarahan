<script lang="ts">
  import { IconSun, IconMoon } from '@tabler/icons-svelte';
  import { toggleMode } from 'mode-watcher';
  import { Button } from '$lib/components/ui/button';
</script>

<Button onclick={toggleMode} variant="outline" size="icon" title="Переключить светлую/тёмную тему">
  <IconSun class="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
  <IconMoon class="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
  <span class="sr-only">Toggle theme</span>
</Button>
