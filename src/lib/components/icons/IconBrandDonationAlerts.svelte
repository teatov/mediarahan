<script lang="ts">
  import type { SvelteHTMLElements, SVGAttributes } from 'svelte/elements';
  import Icon from '$lib/../../node_modules/@tabler/icons-svelte/dist/Icon.svelte';

  const iconNode: [elementName: keyof SvelteHTMLElements, attrs: SVGAttributes<SVGSVGElement>][] = [
    ['path', { d: 'M11.8333 6L11.4167 11M11.1667 14V13.6496' }],
    [
      'path',
      {
        d: 'M4 16.0002L5 4C5 3.73478 5.10436 3.48043 5.29189 3.29289C5.47943 3.10536 5.73378 3 5.999 3H16L19.2236 6.68414C19.4004 6.88617 19.4885 7.15081 19.4682 7.4185L18.999 13.5852L15 17.0002H11L7 21.0002V17.0002H5C4.73478 17.0002 4.48043 16.8948 4.29289 16.7073C4.10536 16.5198 4 16.2654 4 16.0002Z',
      },
    ],
  ];
</script>

<Icon type="outline" name="donationalerts" {...$$props} {iconNode}>
  <slot />
</Icon>
