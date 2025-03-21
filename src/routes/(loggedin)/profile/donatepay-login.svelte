<script lang="ts">
  import type { Snippet } from 'svelte';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import Spinner from '$lib/components/icons/spinner.svelte';
  import A from '$lib/components/typography/A.svelte';
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { donatePayLoginFormSchema, type DonatePayLoginFormSchema } from './schema';

  let {
    data,
    children,
  }: {
    data: SuperValidated<Infer<DonatePayLoginFormSchema>>;
    children: Snippet;
  } = $props();

  let open = $state(false);

  let form = superForm(data, {
    validators: zodClient(donatePayLoginFormSchema),
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
  <Dialog.Trigger class={buttonVariants({ variant: 'donatepay' }) + ' w-full'}>
    {@render children?.()}
  </Dialog.Trigger>
  <Dialog.Content>
    <form method="POST" class="space-y-4" action="?/donatePayLogin" use:enhance>
      <Dialog.Header>
        <Dialog.Title>Подключение DonatePay</Dialog.Title>
        <Dialog.Description>
          К сожалению, DonatePay не предоставляет такого же удобного способа входа как остальные
          сервисы, но он даёт возможность получить API-ключ вручную.
        </Dialog.Description>
        <Dialog.Description>
          Скопируйте его из <A href="https://donatepay.ru/page/api">https://donatepay.ru/page/api</A
          > и вставьте в поле ниже.
        </Dialog.Description>
      </Dialog.Header>

      <Form.Field {form} name="token">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>API-ключ</Form.Label>
            <Input {...props} bind:value={$formData.token} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Dialog.Footer class="items-center">
        <Form.Button disabled={$submitting}>
          {#if $delayed}<Spinner />{/if}
          Подключить
        </Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
