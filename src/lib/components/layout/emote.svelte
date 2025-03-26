<script lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements';
  import type { Emote } from '$lib/emote';

  let { emote, ...restProps }: { emote: Emote } & HTMLImgAttributes = $props();
</script>

<img
  {...restProps}
  src={emote.src}
  alt={emote.name}
  title={emote.name}
  width={emote.width}
  height={emote.height}
/>
