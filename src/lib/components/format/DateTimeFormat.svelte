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

<time
  {...restProps}
  datetime={type === 'date'
    ? datetime.toISOString().split('T')[0]
    : type === 'time'
      ? datetime.toISOString().split('T')[1]
      : datetime.toISOString()}
  >{Intl.DateTimeFormat(
    undefined,
    type === 'date'
      ? { dateStyle: 'medium' }
      : type === 'time'
        ? { timeStyle: 'short' }
        : { timeStyle: 'short', dateStyle: 'short' },
  ).format(datetime)}</time
>
