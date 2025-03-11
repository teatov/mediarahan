<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from "svelte-sonner";
	import { mode } from "mode-watcher";

	let restProps: SonnerProps = $props();
</script>

<Sonner
	theme={$mode}
	class="toaster group"
	expand={true}
	duration={5000}
	visibleToasts={8}
	toastOptions={{
		unstyled: true,
		classes: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground! group-[.toaster]:border-border group-[.toaster]:shadow-lg rounded-lg border shadow-xs w-full p-4 flex items-center gap-2",
			error: 'toast-error group-[.toaster]:bg-destructive group-[.toaster]:border-destructive',
			success: 'toast-success group-[.toaster]:bg-primary group-[.toaster]:border-primary group-[.toaster]:text-primary-foreground!',
			description: "group-[.toast]:text-foreground/60! group-[.toast-success]:text-primary-foreground/60!",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground!",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground!",
		},
	}}
	{...restProps}
/>
