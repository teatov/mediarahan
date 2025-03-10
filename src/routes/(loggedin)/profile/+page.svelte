<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';

  let { data } = $props();
</script>

<div class="mx-auto max-w-xl">
  <h1>{data.user.username}!</h1>
  <form method="post" action="/logout" use:enhance>
    <Button type="submit" variant="destructive">Выйти</Button>
  </form>
</div>
