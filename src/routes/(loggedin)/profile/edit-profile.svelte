<script lang="ts">
  import { IconEdit } from '@tabler/icons-svelte';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import * as Avatar from '$lib/components/ui/avatar';
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as RadioGroup from '$lib/components/ui/radio-group/index';
  import { providerLabels } from '$lib/providers';
  import type { PageServerData } from './$types';
  import { editProfileFormSchema, type EditProfileFormSchema } from './schema';

  let {
    data,
    externalAccounts,
  }: {
    data: SuperValidated<Infer<EditProfileFormSchema>>;
    externalAccounts: PageServerData['user']['externalAccounts'];
  } = $props();

  const form = superForm(data, { validators: zodClient(editProfileFormSchema) });

  const { form: formData, enhance } = form;
</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants()}><IconEdit />Редактировать</Dialog.Trigger>
  <Dialog.Content>
    <form method="POST" class="space-y-4" action="?/editProfile" use:enhance>
      <Dialog.Header>
        <Dialog.Title>Редактировать профиль</Dialog.Title>
      </Dialog.Header>

      <Form.Field {form} name="username">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Имя</Form.Label>
            <Input {...props} bind:value={$formData.username} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Fieldset {form} name="externalAccountAvatar" class="space-y-3">
        <Form.Legend>Аватарка</Form.Legend>
        <RadioGroup.Root
          bind:value={$formData.externalAccountAvatar}
          class="block columns-2"
          name="externalAccountAvatar"
        >
          {#each Object.values(externalAccounts) as externalAccount}
            {#if externalAccount.avatarUrl}
              <div class="flex items-center space-x-3">
                <Form.Control>
                  {#snippet children({ props })}
                    <RadioGroup.Item value={externalAccount.provider} {...props} />
                    <Form.Label class="flex items-center space-x-3">
                      <Avatar.Root class="size-16">
                        <Avatar.Image
                          src={externalAccount.avatarUrl}
                          alt={providerLabels[externalAccount.provider]}
                        />
                        <Avatar.Fallback>?</Avatar.Fallback>
                      </Avatar.Root>
                      <span>
                        {providerLabels[externalAccount.provider]}
                      </span>
                    </Form.Label>
                  {/snippet}
                </Form.Control>
              </div>
            {/if}
          {/each}
        </RadioGroup.Root>
        <Form.FieldErrors />
      </Form.Fieldset>

      <Dialog.Footer>
        <Form.Button>Сохранить</Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
