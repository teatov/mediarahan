import { handleAuthCallback } from '$lib/server/providers';
import type { RequestEvent } from './$types';
import twitch from '$lib/server/providers/twitch';

export async function GET(event: RequestEvent): Promise<Response> {
  return await handleAuthCallback(twitch, event);
}
