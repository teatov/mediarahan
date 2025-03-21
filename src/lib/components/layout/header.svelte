<script lang="ts">
  import { IconLogin } from '@tabler/icons-svelte';
  import Avatar from '$lib/components/layout/avatar.svelte';
  import Logo from '$lib/components/layout/logo.svelte';
  import { Button } from '$lib/components/ui/button';

  let { user, url }: { user: App.Locals['user']; url: URL } = $props();
</script>

{#snippet navLink(href: string, label: string, section: boolean = false, dim: boolean = false)}
  {@const current = section ? url.pathname.startsWith(href) : url.pathname === href}
  <a
    {href}
    class={`inline-block transition-colors hover:text-foreground/80 ${current ? 'text-foreground' : dim ? 'text-foreground/30' : 'text-foreground/60'}`}
  >
    {label}
  </a>
{/snippet}

<header>
  <div class="bg-background border-b py-2 overflow-x-auto">
    <div class="container flex max-w-6xl items-center justify-between h-12 gap-4">
      <nav class="flex items-center gap-4">
        <a href="/" class="inline-block font-bold text-nowrap mr-4">
          <Logo /><span class="px-1">mediarahan</span>
        </a>
        {@render navLink('/', 'Главная')}
        {#if user}
          {@render navLink('/wheel', 'Колесо', true)}
          {@render navLink('/mediasharing', 'Медиашеринг', true, true)}
        {/if}
        {@render navLink('/docs', 'Документация', true)}
      </nav>
      {#if user}
        <a href="/profile" class="inline-block" title="На страницу профиля"><Avatar {user} /></a>
      {:else}
        <Button href="/login"><IconLogin />Войти</Button>
      {/if}
    </div>
  </div>
  {#if url.pathname.startsWith('/wheel')}
    <div class="bg-background border-b py-2 overflow-x-auto">
      <div class="container flex max-w-6xl items-center justify-center gap-4">
        {@render navLink('/wheel', 'Колесо')}
        {@render navLink('/wheel/list', 'Список')}
        {@render navLink('/wheel/settings', 'Настройки')}
      </div>
    </div>
  {/if}
</header>
