<script lang="ts">
  import Logo from '$lib/components/layout/Logo.svelte';
  import { Button } from '$lib/components/ui/button';
  import type { SessionValidationResult } from '$lib/server/auth';
  import { IconLogin } from '@tabler/icons-svelte';
  import Avatar from '$lib/components/layout/Avatar.svelte';

  let { user }: { user: SessionValidationResult['user'] } = $props();
</script>

<header class="bg-background border-b py-2">
  <div class="container flex max-w-6xl items-center justify-between">
    <a href="/" class="inline-block font-bold"><Logo /><span class="px-1">mediarahan</span></a>
    <div>
      {#if user}
        <a href="/profile" class="inline-block" title="На страницу профиля"><Avatar {user} /></a>
      {:else}
        <Button href="/login"><IconLogin />Войти</Button>
      {/if}
    </div>
  </div>
</header>
