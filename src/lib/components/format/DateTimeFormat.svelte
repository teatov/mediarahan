<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    datetime,
    type,
    ...restProps
  }: HTMLAttributes<HTMLElement> & {
    datetime: Date;
    type?: 'date' | 'time' | 'datetime';
  } = $props();
</script>

<time {...restProps} datetime={datetime.toISOString()}
  >{type === 'date'
    ? datetime.toLocaleDateString()
    : type === 'time'
      ? datetime.toLocaleTimeString()
      : datetime.toLocaleString()}</time
>
