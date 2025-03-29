<script lang="ts">
  import { IconRefresh, IconSearch } from '@tabler/icons-svelte';
  import { superForm } from 'sveltekit-superforms';
  import Spinner from '$lib/components/icons/spinner.svelte';
  import Emote from '$lib/components/layout/emote.svelte';
  import { buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index';
  import type { EmoteSet } from '$lib/emote';
  import { cn } from '$lib/utils';

  let { emoteSets }: { emoteSets: EmoteSet[] } = $props();

  let form = superForm(
    {},
    {
      invalidateAll: 'force',
    },
  );

  const { delayed, enhance, submitting } = form;

  let search = $state('');
</script>

<Dialog.Root>
  <Dialog.Trigger class={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}>
    Открыть список смайликов...
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Смайлики</Dialog.Title>
    </Dialog.Header>

    <div class="relative">
      <IconSearch
        class="text-muted-foreground absolute left-2 top-[50%] translate-y-[-50%] pointer-events-none"
      />
      <Input bind:value={search} placeholder="Поиск..." class="pl-10" />
    </div>

    <ScrollArea class="border h-96">
      <ul class="divide-y">
        {#each emoteSets as emoteSet}
          {@const emotes = search
            ? emoteSet.emotes.filter((emote) =>
                emote.name.toLowerCase().includes(search.toLowerCase()),
              )
            : emoteSet.emotes}
          {#if emotes.length > 0}
            <li class="space-y-2 p-2">
              <p class="font-semibold sticky top-0 bg-background">{emoteSet.label}</p>
              <ul class="flex flex-wrap gap-2">
                {#each emotes as emote}
                  <li>
                    <Emote {emote} />
                  </li>
                {/each}
              </ul>
            </li>
          {/if}
        {/each}
      </ul>
    </ScrollArea>

    <Dialog.Description>
      Смайлики не обновляются автоматически. Если вы добавили себе новые или изменили старые, то
      нажмите на кнопку ниже.
    </Dialog.Description>

    <form method="POST" action="?/updateEmotes" use:enhance>
      <Form.Button disabled={$submitting} class="w-full">
        {#if $delayed}<Spinner />{/if}
        <IconRefresh />
        Обновить смайлики
      </Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
