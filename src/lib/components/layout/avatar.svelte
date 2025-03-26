<script lang="ts">
  import { Avatar as AvatarPrimitive } from 'bits-ui';
  import * as Avatar from '$lib/components/ui/avatar';

  let {
    username,
    src,
    ...restProps
  }: { username: string; src: string | null } & AvatarPrimitive.RootProps = $props();
</script>

<Avatar.Root {...restProps}>
  <Avatar.Image {src} alt={username} />
  <Avatar.Fallback>{username.substring(0, 2)}</Avatar.Fallback>
</Avatar.Root>
