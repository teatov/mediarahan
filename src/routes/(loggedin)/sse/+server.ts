import { error } from '@sveltejs/kit';
import { produce } from 'sveltekit-sse';
import { clients } from '$lib/server/sse';
import type { RequestEvent } from './$types';

export async function POST(event: RequestEvent): Promise<Response> {
  if (!event.locals.session) {
    return error(401);
  }

  return produce(
    async function start({ emit }) {
      console.log(`SSE start: ${event.locals.user!.username}!`);
      clients.set(event.locals.session!.userId, { emit });
    },
    {
      stop() {
        console.log(`SSE stop: ${event.locals.user?.username}...`);
        clients.delete(event.locals.session!.userId);
      },
    }
  );
}
