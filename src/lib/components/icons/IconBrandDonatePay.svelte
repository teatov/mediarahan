<script lang="ts">
  import type { SvelteHTMLElements, SVGAttributes } from 'svelte/elements';
  import Icon from '$lib/../../node_modules/@tabler/icons-svelte/dist/Icon.svelte';

  const iconNode: [elementName: keyof SvelteHTMLElements, attrs: SVGAttributes<SVGSVGElement>][] = [
    [
      'path',
      {
        d: 'M9.828 9.172a4 4 0 1 0 0 5.656A9.998 9.998 0 0 0 12 12m0 0a9.999 9.999 0 0 1 2.172-2.828 4 4 0 1 1 0 5.656A9.998 9.998 0 0 1 12 12Zm-5-1.5v3M5.5 12h3m8.5-1.5v.044M15.5 12h.033M17 13.448v.052m1.478-1.5h.022',
      },
    ],
  ];

  let restProps: { [x: string]: any } = $props();
</script>

<Icon type="outline" name="donatepay" {...restProps} {iconNode} />
