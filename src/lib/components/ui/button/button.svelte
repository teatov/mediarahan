<script lang="ts" module>
  import type { WithElementRef } from 'bits-ui';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import { type VariantProps, tv } from 'tailwind-variants';

  export const buttonVariants = tv({
    base: 'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border-input bg-background hover:bg-accent hover:text-accent-foreground border',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        //
        github: 'bg-github text-github-foreground hover:bg-github/90',
        githubOutline:
          'border-github text-github bg-background hover:bg-github hover:text-github-foreground border dark:border-github-foreground dark:text-github-foreground dark:hover:bg-github dark:hover:text-github-foreground dark:hover:border-github',
        twitch: 'bg-twitch text-twitch-foreground hover:bg-twitch/90',
        twitchOutline:
          'border-twitch text-twitch bg-background hover:bg-twitch hover:text-twitch-foreground border',
        google: 'bg-google text-google-foreground hover:bg-google/90',
        googleOutline:
          'border-google-foreground text-google-foreground bg-background hover:bg-google hover:border-google hover:text-google-foreground border dark:border-google dark:text-google dark:hover:bg-google dark:hover:text-google-foreground dark:hover:border-google',
        donationalerts:
          'bg-donationalerts text-donationalerts-foreground hover:bg-donationalerts/90',
        donationalertsOutline:
          'border-donationalerts text-donationalerts bg-background hover:bg-donationalerts hover:text-donationalerts-foreground border',
        donatepay: 'bg-donatepay text-donatepay-foreground hover:bg-donatepay/90',
        donatepayOutline:
          'border-donatepay text-donatepay bg-background hover:bg-donatepay hover:text-donatepay-foreground border',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  });

  export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
  export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
      variant?: ButtonVariant;
      size?: ButtonSize;
    };
</script>

<script lang="ts">
  import { cn } from '$lib/utils.js';

  let {
    class: className,
    variant = 'default',
    size = 'default',
    ref = $bindable(null),
    href = undefined,
    type = 'button',
    children,
    ...restProps
  }: ButtonProps = $props();
</script>

{#if href}
  <a bind:this={ref} class={cn(buttonVariants({ variant, size }), className)} {href} {...restProps}>
    {@render children?.()}
  </a>
{:else}
  <button
    bind:this={ref}
    class={cn(buttonVariants({ variant, size }), className)}
    {type}
    {...restProps}
  >
    {@render children?.()}
  </button>
{/if}
