<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    value,
    currency,
    ...restProps
  }: HTMLAttributes<HTMLElement> & {
    value: number;
    currency?: string;
  } = $props();
</script>

<data {...restProps} {value}
  >{new Intl.NumberFormat(undefined, currency ? { style: 'currency', currency } : undefined).format(
    value,
  )}</data
>
