<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import Spinner from '$lib/components/icons/spinner.svelte';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { buttonVariants, type ButtonVariant } from '$lib/components/ui/button';
  import { type ProviderName, providerLabels } from '$lib/providers';

  let { provider }: { provider: ProviderName } = $props();

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
  <AlertDialog.Trigger class={buttonVariants({ variant: (provider + 'Outline') as ButtonVariant })}>
    Отвязать
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Отвязать {providerLabels[provider]} от аккаунта?</AlertDialog.Title>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Отмена</AlertDialog.Cancel>
      <form method="POST" action={'/logout/' + provider} use:enhance>
        <AlertDialog.Action
          class={buttonVariants({ variant: 'destructive' })}
          type="submit"
          disabled={$submitting}
        >
          {#if $delayed}<Spinner />{/if}
          Отвязать
        </AlertDialog.Action>
      </form>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
