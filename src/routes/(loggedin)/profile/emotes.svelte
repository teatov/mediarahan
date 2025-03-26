<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import Spinner from '$lib/components/icons/spinner.svelte';
  import Emote from '$lib/components/layout/emote.svelte';
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Form from '$lib/components/ui/form';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index';
  import type { EmoteSet } from '$lib/emote';
  import { cn } from '$lib/utils';

  let { emotes }: { emotes: EmoteSet[] } = $props();

  let form = superForm(
    {},
    {
      invalidateAll: 'force',
    },
  );

  const { delayed, enhance, submitting } = form;
</script>

<Dialog.Root>
  <Dialog.Trigger class={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}>
    Открыть список смайликов
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Смайлики</Dialog.Title>
    </Dialog.Header>

    <ScrollArea class="border max-h-96">
      <ul class="space-y-4">
        {#each emotes as emoteSet}
          <li class="space-y-2 p-2">
            <p class="font-semibold">{emoteSet.label}</p>
            <ul class="flex flex-wrap gap-2">
              {#each emoteSet.emotes as emote}
                <li>
                  <Emote {emote} class="size-8" />
                </li>
              {/each}
            </ul>
          </li>
        {/each}
      </ul>
    </ScrollArea>

    <form method="POST" action="?/updateEmotes" use:enhance>
      <Form.Button disabled={$submitting} class="w-full">
        {#if $delayed}<Spinner />{/if}
        Обновить смайлики
      </Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
