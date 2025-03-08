<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte'
	import '../app.css';
	let { children } = $props();
</script>

<ModeWatcher />
<ThemeToggle />
{@render children()}
