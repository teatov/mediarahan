<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<ModeWatcher />
<div class="relative flex min-h-screen flex-col">
	<Header />
	<div class="grow">
		{@render children()}
	</div>
	<Footer />
</div>
