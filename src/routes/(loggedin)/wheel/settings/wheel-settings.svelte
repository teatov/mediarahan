<script lang="ts">
  import { IconCheck } from '@tabler/icons-svelte';
  import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import AutoProviderIcon from '$lib/components/icons/auto-provider-icon.svelte';
  import Spinner from '$lib/components/icons/spinner.svelte';
  import * as Card from '$lib/components/ui/card';
  import { Checkbox } from '$lib/components/ui/checkbox/index';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { PROVIDER_INFO, SOCKET_PROVIDERS, type ProviderName } from '$lib/providers';
  import type { PageData } from './$types';
  import { wheelSettingsFormSchema, type WheelSettingsFormSchema } from './schema';

  let {
    wheelId,
    data,
    externalAccounts,
  }: {
    wheelId: string;
    data: SuperValidated<Infer<WheelSettingsFormSchema>>;
    externalAccounts: PageData['externalAccounts'];
  } = $props();

  let form = superForm(data, {
    validators: zodClient(wheelSettingsFormSchema),
    invalidateAll: 'force',
  });

  const { form: formData, delayed, enhance, submitting } = form;

  function addProvider(provider: ProviderName) {
    $formData.providers = [...$formData.providers, provider];
  }

  function removeProvider(provider: ProviderName) {
    $formData.providers = $formData.providers.filter((i) => i !== provider);
  }

  let socketProviders = $derived(SOCKET_PROVIDERS.filter(
    (providerName) =>
      Object.keys(externalAccounts).includes(providerName) ||
      $formData.providers.includes(providerName),
  ));
</script>

<form method="POST" class="space-y-4" action={'/wheel/settings/' + wheelId} use:enhance>
  <Card.Root class="mx-auto max-w-lg">
    <Card.Content>
      <Form.Button disabled={$submitting} class="w-full">
        {#if $delayed}<Spinner />{/if}
        <IconCheck />Сохранить настройки
      </Form.Button>
    </Card.Content>
    <SuperDebug data={$formData} />
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

      <Form.Fieldset {form} name="providers">
        <Form.Legend>Интеграции</Form.Legend>
        <div class="space-y-2">
          {#each socketProviders as providerName}
            <div class="flex flex-row items-center space-x-3">
              <Form.Control>
                {#snippet children({ props })}
                  <Checkbox
                    {...props}
                    checked={$formData.providers.includes(providerName)}
                    value={providerName}
                    onCheckedChange={(v) => {
                      if (v) {
                        addProvider(providerName);
                      } else {
                        removeProvider(providerName);
                      }
                    }}
                  />
                  <Form.Label
                    class={'font-normal font-base flex items-center gap-2 ' +
                      PROVIDER_INFO[providerName].style}
                  >
                    <AutoProviderIcon {providerName} />
                    {PROVIDER_INFO[providerName].label}
                  </Form.Label>
                {/snippet}
              </Form.Control>
            </div>
          {/each}
          <Form.FieldErrors />
        </div>
      </Form.Fieldset>
    </Card.Content>
  </Card.Root>
</form>
