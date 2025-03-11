<script lang="ts">
  import { IconHourglass } from '@tabler/icons-svelte';

  let restProps: { [x: string]: any } = $props();
</script>

<span {...restProps}>
  <IconHourglass class="animate-spin" />
</span>
