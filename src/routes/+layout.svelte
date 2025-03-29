<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import { toast } from 'svelte-sonner';
  import { getFlash } from 'sveltekit-flash-message';
  import { page } from '$app/state';
  import Footer from '$lib/components/layout/footer.svelte';
  import Header from '$lib/components/layout/header.svelte';
  import { Toaster } from '$lib/components/ui/sonner';
  import '../app.css';

  let { children, data } = $props();

  const flash = getFlash(page);
  $effect(() => {
    if (!$flash) return;
    if ($flash.type === 'success') {
      toast.success($flash.message, { description: $flash.description });
    } else if ($flash.type === 'error') {
      toast.error($flash.message, { description: $flash.description });
    } else {
      toast($flash.message, { description: $flash.description });
    }
    $flash = undefined;
  });
</script>

<ModeWatcher defaultMode="dark" />
<Toaster />
<div class="relative flex min-h-screen flex-col justify-between gap-4">
  <Header user={data.user} url={page.url} avatarUrl={data.avatarUrl} />
  <div class="space-y-4 px-2">
    {@render children()}
  </div>
  <Footer />
</div>
