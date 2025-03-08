<script lang="ts">
	import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte';
</script>

<footer class="container flex max-w-6xl items-center justify-between py-2">
	<p class="text-stone-400">
		Исходный код доступен на
		<a
			href="https://github.com/teatov/mediarahan"
			target="_blank"
			rel="noreferrer noopener"
			class="font-medium underline underline-offset-4">GitHub</a
		>.
	</p>
	<ThemeToggle />
</footer>
