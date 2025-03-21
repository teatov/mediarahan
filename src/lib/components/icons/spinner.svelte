<script lang="ts">
  import { IconHourglass } from '@tabler/icons-svelte';
  import { cn } from '$lib/utils';

  let { class: className, ...restProps }: IconProps = $props();
</script>

<span>
  <IconHourglass class={cn(className, 'animate-spin')} {...restProps} />
</span>
