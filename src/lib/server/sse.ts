import type { Unsafe } from 'sveltekit-sse';
import type { SSE } from '$lib/sse';

export type SSEClient = { emit: (eventName: string, data: string) => Unsafe<void, Error> };

export const clients: Map<string, SSEClient> = new Map();

export function emit(userId: string, event: SSE) {
  clients.get(userId)?.emit('message', JSON.stringify(event));
}
