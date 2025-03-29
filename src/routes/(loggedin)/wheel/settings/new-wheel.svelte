<script lang="ts">
  import { IconPlus } from '@tabler/icons-svelte';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import Spinner from '$lib/components/icons/spinner.svelte';
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { newWheelFormSchema, type NewWheelFormSchema } from './schema';

  let {
    data,
  }: {
    data: SuperValidated<Infer<NewWheelFormSchema>>;
  } = $props();

  let open = $state(false);

  let form = superForm(data, {
    validators: zodClient(newWheelFormSchema),
    invalidateAll: 'force',
    onUpdated({ form }) {
      if (form.valid) {
        open = false;
      }
    },
  });

  const { form: formData, delayed, enhance, submitting } = form;
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={buttonVariants()}><IconPlus />Новое колесо</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Новое колесо</Dialog.Title>
    </Dialog.Header>

    <form method="POST" class="space-y-4" action="?/newWheel" use:enhance>
      <Form.Field {form} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Название</Form.Label>
            <Input {...props} bind:value={$formData.name} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Dialog.Footer>
        <Form.Button disabled={$submitting}>
          {#if $delayed}<Spinner />{/if}
          Создать
        </Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
