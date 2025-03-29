<script lang="ts">
  import type { Snippet } from 'svelte';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import DatetimeFormat from '$lib/components/format/datetime-format.svelte';
  import Spinner from '$lib/components/icons/spinner.svelte';
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Form from '$lib/components/ui/form';
  import * as RadioGroup from '$lib/components/ui/radio-group/index';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index';
  import type { PageData } from './$types';
  import { currentWheelFormSchema, type CurrentWheelFormSchema } from './schema';

  let {
    data,
    wheels,
    children,
  }: {
    data: SuperValidated<Infer<CurrentWheelFormSchema>>;
    wheels: PageData['wheels'];
    children: Snippet;
  } = $props();

  let open = $state(false);

  let form = superForm(data, {
    validators: zodClient(currentWheelFormSchema),
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
  <Dialog.Trigger class={buttonVariants({ variant: 'secondary' }) + ' w-full'}>
    {@render children?.()}
  </Dialog.Trigger>
  <Dialog.Content>
    <form method="POST" class="space-y-4" action="?/currentWheel" use:enhance>
      <Form.Fieldset {form} name="currentWheelId" class="space-y-3">
        <Form.Legend>Колёса</Form.Legend>
        <ScrollArea class="border h-96">
          <RadioGroup.Root
            bind:value={$formData.currentWheelId}
            name="currentWheelId"
            class="block space-y-2 p-2"
          >
            {#each wheels as wheel}
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label class="[&:has([data-state=checked])>div]:border-primary block">
                    <RadioGroup.Item value={wheel.id} {...props} class="sr-only" />
                    <div class="border cursor-pointer p-2 space-y-1">
                      <div class={$formData.currentWheelId === wheel.id ? 'text-primary' : ''}>
                        {wheel.name}
                      </div>
                      <div class="text-muted-foreground text-xs">
                        <DatetimeFormat datetime={wheel.createdAt} type="date" />
                      </div>
                    </div>
                  </Form.Label>
                {/snippet}
              </Form.Control>
            {/each}
          </RadioGroup.Root>
        </ScrollArea>
        <Form.FieldErrors />
      </Form.Fieldset>

      <Dialog.Footer>
        <Form.Button disabled={$submitting}>
          {#if $delayed}<Spinner />{/if}
          Выбрать
        </Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
