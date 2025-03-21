<script lang="ts">
  import { IconTrash } from '@tabler/icons-svelte';
  import { superForm } from 'sveltekit-superforms';
  import Spinner from '$lib/components/icons/spinner.svelte';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { buttonVariants } from '$lib/components/ui/button';

  let open = $state(false);

  const form = superForm(
    {},
    {
      invalidateAll: 'force',
      onUpdated({ form }) {
        if (form.valid) {
          open = false;
        }
      },
    },
  );

  const { delayed, submitting, enhance } = form;
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' }) + ' w-full'}>
    <IconTrash />Удалить аккаунт
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title class="text-destructive">Удалить аккаунт?</AlertDialog.Title>
      <AlertDialog.Description>
        Будет удалено <b>ВСЁ</b> что связано с вашим аккаунтом.
      </AlertDialog.Description>
      <AlertDialog.Description>Навсегда.</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Отмена</AlertDialog.Cancel>
      <AlertDialog.Root>
        <AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
          Удалить
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title class="text-destructive">
              {$submitting ? 'Прощайте...' : 'ТОЧНО?'}
            </AlertDialog.Title>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Не точно</AlertDialog.Cancel>
            <form method="POST" action="?/deleteAccount" use:enhance>
              <AlertDialog.Action
                class={buttonVariants({ variant: 'destructive' })}
                disabled={$submitting}
              >
                {#if $delayed}<Spinner />{/if}
                Точно.
              </AlertDialog.Action>
            </form>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
