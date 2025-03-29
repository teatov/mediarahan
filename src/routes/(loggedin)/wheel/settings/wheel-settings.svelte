<script lang="ts">
  import { IconCheck } from '@tabler/icons-svelte';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import Spinner from '$lib/components/icons/spinner.svelte';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import type { PageServerData } from './$types';
  import { wheelSettingsFormSchema, type WheelSettingsFormSchema } from './schema';

  let {
    wheelId,
    data,
    externalAccounts,
  }: {
    wheelId: string;
    data: SuperValidated<Infer<WheelSettingsFormSchema>>;
    externalAccounts: PageServerData['externalAccounts'];
  } = $props();

  let form = superForm(data, {
    validators: zodClient(wheelSettingsFormSchema),
    invalidateAll: 'force',
  });

  const { form: formData, delayed, enhance, submitting } = form;
</script>

<form method="POST" class="space-y-4" action={'/wheel/settings/' + wheelId} use:enhance>
  <Card.Root class="mx-auto max-w-lg">
    <Card.Content>
      <Form.Button disabled={$submitting} class="w-full">
        {#if $delayed}<Spinner />{/if}
        <IconCheck />Сохранить настройки
      </Form.Button>
    </Card.Content>
  </Card.Root>

  <Card.Root class="mx-auto max-w-lg">
    <Card.Header>
      <Card.Title>Основное</Card.Title>
    </Card.Header>
    <Card.Content class="space-y-4">
      <Form.Field {form} name="name">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Название</Form.Label>
            <Input {...props} bind:value={$formData.name} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </Card.Content>
  </Card.Root>
</form>
