<script lang="ts">
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils';

  let { class: className, children, href, ...restProps }: HTMLAnchorAttributes = $props();
</script>

<a
  class={cn('font-medium text-primary underline underline-offset-4', className)}
  {href}
  {...restProps}
  target={href?.startsWith('/') ? undefined : '_blank'}
  rel={href?.startsWith('/') ? undefined : 'noreferrer noopener'}>{@render children?.()}</a
>
