<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar';
  import type { SessionValidationResult } from '$lib/server/auth';

  interface Props {
    user: SessionValidationResult['user'];
    [key: string]: any
  }

  let { user, ...rest }: Props = $props();
</script>

<Avatar.Root {...rest}>
  <Avatar.Image src={user?.avatarUrl} alt={user?.username} />
  <Avatar.Fallback>{user?.username.substring(0, 2)}</Avatar.Fallback>
</Avatar.Root>
