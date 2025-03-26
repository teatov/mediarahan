<script lang="ts">
  import { IconEdit } from '@tabler/icons-svelte';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import Spinner from '$lib/components/icons/spinner.svelte';
  import * as Avatar from '$lib/components/ui/avatar';
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as RadioGroup from '$lib/components/ui/radio-group/index';
  import { providerInfo } from '$lib/providers';
  import type { PageServerData } from './$types';
  import { editProfileFormSchema, type EditProfileFormSchema } from './schema';

  let {
    data,
    externalAccounts,
  }: {
    data: SuperValidated<Infer<EditProfileFormSchema>>;
    externalAccounts: PageServerData['externalAccounts'];
  } = $props();

  let open = $state(false);

  let form = superForm(data, {
    validators: zodClient(editProfileFormSchema),
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
  <Dialog.Trigger class={buttonVariants()}><IconEdit />Редактировать</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Редактировать профиль</Dialog.Title>
    </Dialog.Header>

    <form method="POST" class="space-y-4" action="?/editProfile" use:enhance>
      <Form.Field {form} name="username">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Имя</Form.Label>
            <Input {...props} bind:value={$formData.username} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Fieldset {form} name="avatarProvider" class="space-y-3">
        <Form.Legend>Аватарка</Form.Legend>
        <RadioGroup.Root
          bind:value={$formData.avatarProvider}
          class="grid grid-cols-3 sm:grid-cols-5 gap-2"
          name="avatarProvider"
        >
          {#each Object.values(externalAccounts) as externalAccount}
            {#if externalAccount.avatarUrl}
              <Form.Control>
                {#snippet children({ props })}
                  {@const providerLabel = providerInfo[externalAccount.provider].label}
                  <Form.Label
                    class="[&:has([data-state=checked])>div]:ring-primary flex flex-col items-center gap-2"
                  >
                    <RadioGroup.Item value={externalAccount.provider} {...props} class="sr-only" />
                    <Avatar.Root
                      class="size-16 ring-offset-background ring-2 ring-muted ring-offset-3 cursor-pointer"
                    >
                      <Avatar.Image src={externalAccount.avatarUrl} alt={providerLabel} />
                      <Avatar.Fallback>?</Avatar.Fallback>
                    </Avatar.Root>
                    <span class="text-xs">{providerLabel}</span>
                  </Form.Label>
                {/snippet}
              </Form.Control>
            {/if}
          {/each}
        </RadioGroup.Root>
        <Form.FieldErrors />
      </Form.Fieldset>

      <Dialog.Footer>
        <Form.Button disabled={$submitting}>
          {#if $delayed}<Spinner />{/if}
          Сохранить
        </Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
