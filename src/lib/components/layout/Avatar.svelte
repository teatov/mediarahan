<script lang="ts">
  import { Avatar as AvatarPrimitive } from 'bits-ui';
  import * as Avatar from '$lib/components/ui/avatar';

  let { user, ...restProps }: { user: App.Locals['user'] } & AvatarPrimitive.RootProps = $props();
</script>

<Avatar.Root {...restProps}>
  <Avatar.Image src={user?.avatarUrl} alt={user?.username} />
  <Avatar.Fallback>{user?.username.substring(0, 2)}</Avatar.Fallback>
</Avatar.Root>
