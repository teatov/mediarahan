<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import { page } from '$app/state';
  import Footer from '$lib/components/layout/Footer.svelte';
  import Header from '$lib/components/layout/Header.svelte';
  import { Toaster } from '$lib/components/ui/sonner';
  import '../app.css';

  let { children, data } = $props();
</script>

<ModeWatcher />
<Toaster />
<div class="relative flex min-h-screen flex-col justify-between">
  <Header user={data.user} url={page.url} />
  <div class="space-y-4">
    {@render children()}
  </div>
  <Footer />
</div>
