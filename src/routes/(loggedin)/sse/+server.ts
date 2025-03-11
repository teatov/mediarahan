import { redirect } from '@sveltejs/kit';
import { produce } from 'sveltekit-sse';
import type { RequestEvent } from './$types';

function delay(milliseconds: number) {
  return new Promise(function run(resolve) {
    setTimeout(resolve, milliseconds);
  });
}

export async function POST(event: RequestEvent): Promise<Response> {
  if (!event.locals.session) {
    return redirect(302, '/login');
  }

  return produce(
    async function start({ emit }) {
      console.log('sse start!');
      while (true) {
        const { error } = emit(
          'message',
          JSON.stringify({ type: 'test', message: `the time is ${Date.now()}` })
        );
        if (error) {
          return;
        }
        await delay(1000);
      }
    },
    {
      stop() {
        console.log('sse stop...');
      },
    }
  );
}
