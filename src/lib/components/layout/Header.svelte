<script lang="ts">
  import Logo from '$lib/components/layout/Logo.svelte';
  import { Button } from '$lib/components/ui/button';
  import { IconLogin } from '@tabler/icons-svelte';
</script>

<header class="bg-background border-b py-2">
  <div class="container flex max-w-6xl items-center justify-between">
    <a href="/" class="block font-bold"><Logo /><span class="px-1">mediarahan</span></a>
    <div>
      <Button href="/login"><IconLogin />Войти</Button>
    </div>
  </div>
</header>
