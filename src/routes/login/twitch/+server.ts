import type { RequestEvent } from './$types';
import { handleAuthRedirect } from '$lib/server/providers';
import twitch from '$lib/server/providers/twitch';

export function GET(event: RequestEvent): Response {
  return handleAuthRedirect(twitch, event);
}
